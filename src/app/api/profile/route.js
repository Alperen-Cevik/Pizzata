import {
  authOptions,
  isAdmin,
  isCourier,
  isRestaurant,
} from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import userinfos from "../../../../public/db/userinfos.json";

export async function PUT(req) {}

export async function GET(req) {
  const session = await getServerSession(authOptions);

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");
  if (!_id) {
    console.log(session.user);

    if (session.user) return Response.json(session.user);

    return Response.json({});
  } else {
    const admin = await isAdmin();
    const restaurant = await isRestaurant();
    const courier = await isCourier();
    if (!admin) return Response.json();
    if (!restaurant) return Response.json();
    if (!courier) return Response.json();

    const userInfo = userinfos.find((user) => user._id.toString() === _id);

    if (userInfo) return Response.json(userInfo);

    return Response.json({});
  }
}
