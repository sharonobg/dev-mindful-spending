import { getToken } from "next-auth/jwt"
import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth"
import {authOptions}from"../auth/[...nextauth]/route"
import Spendingplan from "@/models/spendingplanModel";
import User from "@/models/userModel";

const FOODS = [
    "French Fries",
    "Dog food",
    "Cat food",
]

export async function GET(){
    
        await new Promise((resolve) => setTimeout(resolve,1000));
        
        return NextResponse.json(FOODS);
  }

