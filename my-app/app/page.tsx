import { Appbar } from "./components/Appbar";
import { useState } from "react";
import {Music, Users, Zap } from "lucide-react";
import { Redirect } from "./components/Redirect";
import Link from "next/link";

export default function Preview() {
  
  return (
    <div className="w-full bg-gray-900 border border-gray-800 shadow-lg overflow-hidden text-gray-100">
      <Appbar></Appbar>
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white px-6 py-12 text-center border-b border-gray-800">
        <h1 className="text-4xl font-bold mb-4">
          Let Your Community Choose Your Stream's Soundtrack
        </h1>
        <p className="text-lg mb-6 text-purple-200">
          Transform your streams with interactive music requests.
        </p>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-bold">
          Start Now
        </button>
      </div>

      {/* Features */}
      <div className="p-6 bg-gray-900">
        <h2 className="text-2xl font-bold text-center mb-8 text-purple-100">
          Why Creators Love StreamTunes
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <FeatureCard
            icon={<Music className="w-6 h-6 text-purple-400" />}
            title="Song Requests"
            desc="Let viewers add songs to queue using channel points"
          />
          <FeatureCard
            icon={<Users className="w-6 h-6 text-purple-400" />}
            title="Community Voting"
            desc="Democratic song selection and skip voting"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-purple-400" />}
            title="Easy Integration"
            desc="Works with Spotify, YouTube Music, and more"
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-800 p-6">
        <h2 className="text-2xl font-bold text-center mb-8 text-purple-100">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Step
            number="1"
            title="Connect Your Account"
            desc="Link your streaming platform and music service"
          />
          <Step
            number="2"
            title="Set Your Rules"
            desc="Configure point costs and voting settings"
          />
          <Step
            number="3"
            title="Go Live"
            desc="Let your community drive the music"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-8 text-center border-t border-gray-800">
        <h2 className="text-2xl font-bold mb-4">
          Ready to Transform Your Streams?
        </h2>
        <p className="text-purple-200 mb-6">
          Join thousands of creators who've enhanced their streams with
          interactive music
        </p>
        <Link className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-bold" href={"/dashboard"} >
          Create your space
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: String, desc: String }) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg text-center border border-gray-700 hover:border-purple-500 transition-colors">
      <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <h3 className="font-semibold mb-2 text-purple-100">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }:{ number: String, title: String, desc: String }) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mb-3 font-bold">
        {number}
      </div>
      <h3 className="font-semibold mb-2 text-purple-100">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}
