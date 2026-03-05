"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Shield, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-10">
      <div className="text-center space-y-4">
        <h1 className="font-bold text-4xl md:text-5xl">Skincare Tracker</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Track your skincare products, monitor expiration dates, and never waste a product again.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 w-full max-w-2xl">
        <Card className="text-center">
          <CardContent className="pt-6 space-y-2">
            <Calendar className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-semibold">Track Expiration</h3>
            <p className="text-sm text-muted-foreground">
              Know when products expire
            </p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6 space-y-2">
            <Clock className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-semibold">Monitor Usage</h3>
            <p className="text-sm text-muted-foreground">
              Track when you open and finish products
            </p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6 space-y-2">
            <Shield className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-semibold">Stay Organized</h3>
            <p className="text-sm text-muted-foreground">
              All your products in one place
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/sign-up">Get Started</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
