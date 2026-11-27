
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin";

type Applicant = {
  application_no: string;
  name: string;
  department: string | null;
  status: "accepted" | "rejected" | "waitlist" | null;
};

async function authorize(req: Request) {
  const token = req.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");
  return !!token && await isAdmin(token);
}

export async function GET(req: Request) {
  if (!await authorize(req))
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });

  const { data, error } = await adminDb()
    .from("applicants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: "지원자 목록을 불러오지 못했습니다." }, { status: 500 });

  return NextResponse.json({ applicants: data || [] });
}

export async function POST(req: Request) {
  if (!await authorize(req))
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });

  const body = await req.json();
  const rows: any[] = Array.isArray(body.applicants) ? body.applicants : [body];

  if (!rows.length || rows.length > 1000)
    return NextResponse.json({ error: "한 번에 최대 1,000명까지 등록할 수 있습니다." }, { status: 400 });

  const clean: Applicant[] = rows.map((x: any) => ({
    application_no: String(x.application_no || "").trim(),
    name: String(x.name || "").trim(),
    department: String(x.department || "").trim() || null,
    status: ["accepted", "rejected", "waitlist"].includes(x.status) ? x.status : null
  }));

  if (clean.some((x: Applicant) => !x.application_no || !x.name))
    return NextResponse.json({ error: "모든 지원자의 접수번호와 이름은 필수입니다." }, { status: 400 });

  const { data, error } = await adminDb()
    .from("applicants")
    .upsert(clean, { onConflict: "application_no" })
    .select("*");

  if (error)
    return NextResponse.json({ error: error.code === "23505" ? "중복된 접수번호가 있습니다." : "저장에 실패했습니다." }, { status: 400 });

  return NextResponse.json({ applicants: data || [], message: `${data?.length || 0}명 저장 완료` });
}

export async function PATCH(req: Request) {
  if (!await authorize(req))
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });

  const body = await req.json();
  if (!body.id)
    return NextResponse.json({ error: "지원자 ID가 필요합니다." }, { status: 400 });

  const update: any = {};
  for (const k of ["application_no", "name", "department", "status"])
    if (k in body) update[k] = body[k];

  const { data, error } = await adminDb()
    .from("applicants")
    .update(update)
    .eq("id", body.id)
    .select("*")
    .single();

  if (error)
    return NextResponse.json({ error: "수정에 실패했습니다. 접수번호 중복 여부를 확인해 주세요." }, { status: 400 });

  return NextResponse.json({ applicant: data });
}

export async function DELETE(req: Request) {
  if (!await authorize(req))
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });

  const body = await req.json();
  if (!body.id)
    return NextResponse.json({ error: "지원자 ID가 필요합니다." }, { status: 400 });

  const { error } = await adminDb()
    .from("applicants")
    .delete()
    .eq("id", body.id);

  if (error)
    return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 400 });

  return NextResponse.json({ ok: true });
}
