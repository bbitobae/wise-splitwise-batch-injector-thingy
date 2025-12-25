import {NextResponse} from "next/server";
import {Client, OAuth2User} from "splitwise-ts";

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200 });
}

export async function POST(req: Request) {
    let result;
    try {
        result = await req.json().then(async data => {
            const clientID = data.clientId
            const clientSecret = data.clientSecret
            if (!clientID) return Promise.reject(new Error("Missing client ID"));
            if (!clientSecret) return Promise.reject(new Error("Missing client secret"));

            const user = new OAuth2User({
                clientId: clientID,
                clientSecret: clientSecret
            })

            await user.requestAccessToken();
            const client = new Client(user)

            return client.groups.getGroups()
                .then(result => {
                    if (!result || !result.groups) return Promise.reject(new Error("Groups result is empty"));
                    return result.groups.map((group) => {
                        return {id: group.id, name: group.name}
                    });
                })
                .catch((error: Error) => {
                    console.error(error);
                    return Promise.reject(error)
            })
        })
    } catch {
        return NextResponse.json({error: "Unable to connect to Splitwise API"}, {status: 500});
    }
    if (!result) return NextResponse.json({error: "Unable to connect to Splitwise API"}, {status: 500});
    return NextResponse.json({groups: result})

}