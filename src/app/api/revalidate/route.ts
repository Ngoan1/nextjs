import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest){
  const secret = request.nextUrl.searchParams.get('secret')
  const tag = request.nextUrl.searchParams.get('tag')
  if(secret !== process.env.PASS_WORD_SECRET){
    return NextResponse.json({message:'sai pass nha '},{status:401})
  }
  if(!tag){
    return NextResponse.json({message:'sai tag nha '},{status:400})
  }
  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, now: Date.now() });
};