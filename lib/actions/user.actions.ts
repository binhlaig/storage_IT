"use server";

import { ID, Query } from "node-appwrite";
import { CreateAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { requestToBodyStream } from "next/dist/server/body-streams";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


const getUserByEmail = async (email: string) => {
    const { databases } = await CreateAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])]
    );

    return result.total > 0 ? result.documents[0] : null
}

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;

}

export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await CreateAdminClient();
    try {
        const session = await account.createEmailToken(ID.unique(), email);
        return session.userId;

    } catch (error) {
        handleError(error, "Fail to send email OTP");
    }
}

export const createAccount = async ({ fullName, email, }: { fullName: string; email: string }) => {

    const exisitingUser = await getUserByEmail(email);
    const accountId = await sendEmailOTP({ email });
    if (!accountId) throw new Error("Faild to send an OTP");

    if (!exisitingUser) {
        const { databases } = await CreateAdminClient();

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            { // Wrap the object properties in curly braces
                fullName,
                email,
                avatar:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl_xUfgsEggfsK-KqiOJYgPrPSqtRyQzC0fw&s",
                accountId,

            }
        )
    }

    return parseStringify({ accountId });

}

export const verifySecret = async ({ accountId, password }: { accountId: string; password: string }) => {
    try {
        const { account } = await CreateAdminClient();

        const session = await account.createSession(accountId, password);

        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
        return parseStringify({ sessionId: session.$id });

    } catch (error) {
        handleError(error, "Failded to verify OTP")

    }
}

export const getCurrentUser = async () => {

    try {
        const { databases, account } = await createSessionClient();

        const result = await account.get();

        const user = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("accountId", result.$id)],
        );

        if (user.total <= 0) return null;

        return parseStringify(user.documents[0]);
    } catch (error) {
        console.log(error);
    }
}
export const signOutUser = async () => {
    const { account } = await createSessionClient();

    try {
        await account.deleteSession("current");
        (await cookies()).delete("appwrite-session");

    } catch (error) {
        handleError(error, "Failed to sign out user");
    } finally {
        redirect("/sign-in");

    }
}