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

            const groupId = data.groupId

            return client.groups.getGroup(groupId)
                .then(result => {
                    if (!result || !result.group) return Promise.reject(new Error("Group result is empty"));
                    if (!result.group.members) return Promise.reject(new Error("Group member list is empty"));
                    const members = result.group.members.map((member) => {
                        return {
                            id: member.id,
                            name: `${member.first_name ? member.first_name : ""} ${member.last_name ? member.last_name : ""}`,
                        }
                    })
                    return {
                        id: result.group.id,
                        name: result.group.name,
                        members: members
                    }
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
    return NextResponse.json({group: result})

}
