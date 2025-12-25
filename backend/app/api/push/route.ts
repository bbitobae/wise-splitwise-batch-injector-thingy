import {NextResponse} from "next/server";
import {Client, OAuth2User} from "splitwise-ts";
import Moment from 'moment';

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200 });
}

export async function POST(req: Request) {
    let result;
    const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss';

    const determineCategory = (category: string) => {
        enum splitwiseCategories {
            utilities = 1,
            uncategorized = 2,
            entertainment = 19,
            foodAndDrink = 25,
            home = 27,
            transportation = 31,
            life = 40
        }
        switch (category) {
            case 'Shopping':
                return splitwiseCategories.home
            case 'Groceries':
                return splitwiseCategories.foodAndDrink
            case 'Eating out':
                return splitwiseCategories.foodAndDrink
            case 'Transport':
                return splitwiseCategories.transportation
            case 'Trips':
                return splitwiseCategories.entertainment
            default:
                return splitwiseCategories.uncategorized
        }
    }

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

            const transaction = data.transaction
            if (!transaction) return Promise.reject(new Error("Missing transaction"));

            const groupId = data.groupId
            if (!groupId) return Promise.reject(new Error("Missing groupId"));

            const isCurrencyAllowed = await client.other.getCurrencies().then((currencies) => {
                if (!currencies.currencies) return Promise.reject(new Error("Missing currencies"));
                return currencies.currencies.map((currency) => currency.currency_code ? currency.currency_code : "")
                    .filter((code) => code == transaction.currency_code).length > 0
            })
            if (isCurrencyAllowed) {
                return Promise.reject(new Error("Currency not allowed"));
            }

            const transactionCategory = determineCategory(transaction.category).valueOf();
            const isCategoryAllowed = await client.other.getCategories().then((categories) => {
                if (!categories.categories) return Promise.reject(new Error("Missing categories"));determineCategory(transaction.category).valueOf()
                return categories.categories.map((category) => category.id ? category.id : 0)
                    .filter((categoryId) => categoryId == transactionCategory).length > 0
            })
            if (!isCategoryAllowed) {
                return Promise.reject(new Error("Category not allowed"));
            }

            return client.expenses.createExpense({
                cost: transaction.amount.toString(),
                description: transaction.name,
                details: `${transaction.name}: [${transaction.category}]`,
                date: Moment(transaction.createdOn).format(dateTimeFormat),
                repeat_interval: 'never',
                currency_code: transaction.currency,
                category_id: transactionCategory,
                group_id: groupId,
                split_equally: true
            })

            // return client.groups.getGroup(groupId)
            //     .then(result => {
            //         if (!result || !result.group) return Promise.reject(new Error("Group result is empty"));
            //         if (!result.group.members) return Promise.reject(new Error("Group member list is empty"));
            //         const members = result.group.members.map((member) => {
            //             return {
            //                 id: member.id,
            //                 name: `${member.first_name ? member.first_name : ""} ${member.last_name ? member.last_name : ""}`,
            //             }
            //         })
            //         return {
            //             id: result.group.id,
            //             name: result.group.name,
            //             members: members
            //         }
            //     })
            //     .catch((error: Error) => {
            //         console.error(error);
            //         return Promise.reject(error)
            //     })
        })
    } catch {
        return NextResponse.json({error: "Unable to connect to Splitwise API"}, {status: 500});
    }
    if (!result) return NextResponse.json({error: "Unable to connect to Splitwise API"}, {status: 500});
    return NextResponse.json({}, {status: 200})

}
