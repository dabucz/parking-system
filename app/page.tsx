"use client";

import { pb } from '@/app/lib/db';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RecordModel } from 'pocketbase';
import Navbar from '@/app/components/navbar'
export default function Home() {
  pb.autoCancellation(false);
  const [data, setData] = useState<RecordModel[]>([]);
  const [occupations, setOccupations] = useState<RecordModel[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const isLoggedIn = pb.authStore.isValid;
  const [date, setDate] = useState<Date>(new Date());
  const [userID, setUserID] = useState(null);
  const fetchData = async () => {
    try {
      const records = await pb.collection('parking_spaces').getFullList({
        sort: '+number',
      });
      const recordsOccupy = await pb.collection('occupations').getFullList({
        sort: 'dateOccupied',
        expand: 'user'
      });
      setOccupations(recordsOccupy);
      setData(records);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const isOccupied = (parking: any, date: any) => {
    return occupations.some(occupation =>
      occupation.parkingSpace === parking.id && formatDate(occupation.dateOccupied) === formatDate(date)
    );
  };

  function formatDate(time: any) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const datee = `${year}-${month}-${day}`;
    return datee;
  }

  function occupySpace(parking: any) {
    const data = {
      "dateOccupied": formatDate(date) +" 00:00:00Z",
      "user": pb.authStore.model?.id,
      "parkingSpace": parking.id
    };
    const createOccupation = async () => {
      const record = await pb.collection('occupations').create(data);
    }
    createOccupation();

    fetchData();
  }

  function deleteOccupation(occupation: any) {
    const deleteOccupation = async () => {
      await pb.collection('occupations').delete(occupation.id);
    }
    deleteOccupation();
    fetchData();
  }
  function setListingDate(a: any) {
    setDate(a);
  }

  useEffect(() => {
    fetchData();
    try {
      setUserID(pb.authStore.model?.id);
    } catch (err) {
      
    }
    return () => {
    };
  }, []);
  if (!isLoaded) {
    return <>Loading</>
  }
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="m-4">
        <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setListingDate}
              initialFocus
              ISOWeek
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-wrap gap-4 justify-center pt-4">
      {data.map(parking => (
        <Card key={parking.id} className="flex justify-between flex-col">
          <CardHeader>
            <CardTitle>{parking.number}</CardTitle>
            <CardDescription>Occupations:</CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              {occupations
              .filter(occupation => occupation.parkingSpace === parking.id)
              .filter(occupation => formatDate(occupation.dateOccupied) === formatDate(date))
              .map((occupation) => (
                <li key={occupation.id}>
                  {occupation.expand ? (
                    <>{occupation.expand.user.username} {occupation.user == userID ? (
                      <Button onClick={() => {deleteOccupation(occupation)}}>Delete</Button>
                    ) : null}</>
                  ) : (
                    <span>Unknown user</span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger disabled={!isLoggedIn || isOccupied(parking,date)}>
                <Button className={`${parking.id === 'ctvk7xskx6iveem' ? 'bg-red-500' : ''}`} disabled={!isLoggedIn || isOccupied(parking,date)}>
                  Occupy
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will occupy parking space {parking.number} for {formatDate(date)}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {occupySpace(parking)}}>Occupy</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
      </div>
    </main>
  );
}
