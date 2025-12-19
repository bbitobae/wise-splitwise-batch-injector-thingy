import {NextResponse} from "next/server";
import {OAuth2User} from "splitwise-ts";

export async function OPTIONS() {
    return NextResponse.json({}, {status: 200})
}

export async function POST(req: Request) {
    console.log("login request");
    let result;
    try {
        result = await req.json().then(async data => {
            const clientID = data.clientId
            const clientSecret = data.clientSecret
            if (!clientID) return Promise.reject(new Error("Missing client ID"));
            if (!clientSecret) return Promise.reject(new Error("Missing client secret"));

            console.log(clientID)
            console.log(clientSecret);

            const user = new OAuth2User({
                clientId: clientID,
                clientSecret: clientSecret
            })

            let res;
            try {
                res = await user.requestAccessToken();
            } catch (err) {
                console.error(`Failed to fetch access token from Splitwise API: ${err}`);
                res = await Promise.reject(err);
            }
            const token = res.access_token;
            if (!token)
                return Promise.reject(new Error("Access token not found"));
            return token;
        })
    } catch {
        return NextResponse.json({error: "Unable to connect to Splitwise API"}, {status: 500});
    }
    if (!result) return NextResponse.json({error: "Unable to connect to Splitwise API"}, {status: 500});
    return NextResponse.json({token: result})
}
