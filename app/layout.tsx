import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "경기고등학교 방송부 합격자 조회", description: "경기고등학교 방송부 신입 부원 모집 결과 조회" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ko"><body>{children}</body></html>; }