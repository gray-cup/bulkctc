"use client";

import Image from "next/image";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaGithub, FaLinkedin, FaGlobeAsia, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";

type Tier = {
  name: string;
  price: string;
  cta: string;
  ctaVariant?: "default" | "blue" | "red";
  features: string[];
  flagText?: string;
};

/* ---------- Page ---------- */
export default function AboutPage() {
  return (
    <div className="min-h-screen py-20 px-4 lg:px-6">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <div className="text-start mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-3">
            About Gray Cup
          </h1>
          <p className="text-md md:text-lg text-muted-foreground">
            What are we? Who Started this? Started why?
          </p>
        </div>

        <div>
          {/* <p>
            <span className="font-semibold">Legal Name</span>: Gray Cup
            Enterprises Private Limited
            <br />
            <span className="font-semibold">Country</span>: India/Bharat
            <br />
            <span className="font-semibold">Incorporation Date</span>: 7th
            November, 2025
            <br />
            <span className="font-semibold">CIN</span>: U47211DL2025PTC457808
            <br />
            <span className="font-semibold">GST</span>: 06AAMCG4985H1Z4
            <br />
            <span className="font-semibold">UPI ID</span>: graycup@kotak
          </p> */}

          <h3 className="text-lg md:text-xl font-semibold text-neutral-800 mt-4 mb-2">
            Other Sites
          </h3>
          <p>
            <span className="font-semibold">Online Store for Consumers</span>:{" "}
            <a href="https://graycup.in/" className="link" target="_blank">
              graycup.in
            </a>
            (India Only)
          </p>
          <p>
            <span className="font-semibold">Online Store for Businesses</span>:{" "}
            <a href="https://b2b.graycup.in/" className="link" target="_blank">
              b2b.graycup.in
            </a>
            (Worldwide)
          </p>
          <p>
            <span className="font-semibold">IndiaMart</span>:{" "}
            <a
              href="https://www.indiamart.com/gray-cup-enterprises/"
              className="link"
              target="_blank"
            >
              indiamart.com/gray-cup-enterprises
            </a>
          </p>
        </div>
        <hr className="my-8" />

        <h2 className="text-xl md:text-2xl font-medium text-neutral-800 my-4">
          Notable People
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="flex flex-col border border-gray-200 w-fit rounded-2xl p-3">
            <Image
              src="/arjun.png"
              className="rounded-sm"
              alt="arjun profile photo"
              height="200"
              width="200"
            />
            <p className="text-md text-nowrap lg:max-w-fit font-medium mt-3">
              Arjun Aditya (Director)
            </p>
            <p className="text-xs text-nowrap text-muted-foreground mt-0.5 mb-4">
              A Homo Sapien who loves nature,
              <br /> code and design.
            </p>
            <div className="flex items-center gap-3">
              <Link
                className="opacity-75 hover:opacity-100 transition-opacity"
                target="_blank"
                href="https://arjunaditya.xyz"
              >
                <FaGlobeAsia size={18} />
              </Link>
              <Link
                className="opacity-75 hover:opacity-100 transition-opacity"
                target="_blank"
                href="https://github.com/nermalcat69"
              >
                <FaGithub size={18} />
              </Link>
              <Link
                className="opacity-75 hover:opacity-100 transition-opacity"
                target="_blank"
                href="https://www.linkedin.com/in/nermalcat69/"
              >
                <FaLinkedin size={18} />
              </Link>
              <Link
                className="opacity-75 hover:opacity-100 transition-opacity"
                target="_blank"
                href="https://x.com/arjunaditya_"
              >
                <FaXTwitter size={18} />
              </Link>
              <Link
                className="opacity-75 hover:opacity-100 transition-opacity"
                target="_blank"
                href="https://instagram.com/arjun_sustains"
              >
                <FaInstagram size={18} />
              </Link>
              <Link
                className="opacity-75 hover:opacity-100 transition-opacity"
                target="_blank"
                href="mailto:arjunaditya@icloud.com"
              >
                <IoIosMail size={20} />
              </Link>
            </div>
            <a
              className="mt-4 mb-2"
              href="https://cal.com/arjunaditya/30min?user=arjunaditya"
              target="_blank"
            >
              <Button variant="lightgraybg" size="minor">
                Schedule Call
              </Button>
            </a>
          </div>
          {/* <div>
            <Image
              src="/anju.png"
              alt="arjun profile photo"
              height="200"
              width="200"
            />
            <p className="text-lg font-medium py-2">
              Anju Lata
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
