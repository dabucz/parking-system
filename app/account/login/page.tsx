"use client";
import { navigate } from '@/app/actions'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { pb } from "@/app/lib/db"
import {useState, useEffect} from "react"
import { GoogleLoginButton } from "react-social-login-buttons";

export default function LoginPage() {
    const [isClient, setIsClient] = useState(false)
 
    useEffect(() => {
        setIsClient(true);
    }, [])

    function redirect() {
        if (pb.authStore.isValid) {
            navigate("/");
        }
    }

    const authGoogle = async () => {
        const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
        pb.authStore.exportToCookie({ httpOnly: false });
        redirect();
    }
    if (!isClient) {
        return <>Loading</>
    }
    return (
        <main className="flex justify-center items-center min-h-screen">
            <div className="flex justify-center">
                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <GoogleLoginButton onClick={authGoogle} />
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}