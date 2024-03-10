import { useState, useEffect } from 'react'
import { pb } from '@/app/lib/db'
import { navigate } from '@/app/actions'
import { Button } from "@/components/ui/button"
import RHLogo from '@/public/rhLogo.svg'
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Moon, Sun, LogIn, LogOut, CircleUser } from "lucide-react"
import { useTheme } from "next-themes"
const formSchema = z.object({
  firstname: z.string(),
  surname: z.string(),
  username: z.string(),
})

interface oauthModel {
  provider: string;
}

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isLoaded, setIsLoaded] = useState(false);
  const [oauthData,setOauthData] = useState<oauthModel[]>([]);
  const authGoogle = async () => {
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
  }
  
  const authTypes = async () => {
    const result = await pb.collection('users').listExternalAuths(pb.authStore.model?.id);
    setOauthData(result);
  }
  
  useEffect(() => {
    setIsLoaded(true);
    if (pb.authStore.isValid) {
      authTypes();
    }
  }, []);

  function toggleTheme() {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }

  function ThemeBTN() {
    return (
      <Button variant="outline" size="icon" onClick={toggleTheme}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  function RHLogoBTN() {
    return (
      <div className="flex flex-row h-8 gap-2 items-center">
        <Image src={RHLogo} alt="rhLOGO" className="w-8 cursor-pointer" onClick={() => {navigate("/")}} />
      </div>
    )
  }

  if (!isLoaded) {
    return <>Loading</>
  }
  return (
    <div className="flex flex-row justify-between gap-4 px-4 border-b-2 p-4">
      {pb.authStore.isValid ? (
        <>
          <div className="flex gap-4">
            {!oauthData.some(item => item.provider === 'google') && (
              <button onClick={authGoogle}>Connect Google</button>
            )}
            <RHLogoBTN />
          </div>
          <div className="flex items-center gap-4">
            <ThemeBTN />
            <Account />
            <Button size="icon" onClick={() => { pb.authStore.clear(); navigate("/account/login"); }} variant="outline">
              <LogOut className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <div>
            <RHLogoBTN />
          </div>
          <div className="flex flex-row gap-4 items-center">
            <ThemeBTN />
            <Button size="icon" onClick={() => { navigate("/account/login"); }} variant="outline"><LogIn className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" /></Button>
          </div>
        </>
      )}
    </div>
  );
}

function Account() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      surname: "",
      username: "",
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {};

    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== "")
    );

    Object.assign(data, filteredValues);
    const updateUser = async () => {
      const record = await pb.collection('users').update(pb.authStore.model?.id, data);
    }
    updateUser();
    form.reset();
    setDialogIsOpen(false);
  }
  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon"><CircleUser className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all"/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder={pb.authStore.model?.firstname} {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your first name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surname</FormLabel>
                    <FormControl>
                      <Input placeholder={pb.authStore.model?.surname} {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your last name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder={pb.authStore.model?.username} {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}