import { getCurrentUser } from "@/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UpdateUserProfileForm from "@/components/forms/auth/update-user-profile-form";

export default async function StackedForm() {
    const user = await getCurrentUser();

    return (
        <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <UpdateUserProfileForm user={user} />
                </CardContent>
            </Card>
        </div>
    );
}
