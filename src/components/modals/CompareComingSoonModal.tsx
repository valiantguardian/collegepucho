"use client";
import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  LuX, 
  LuTrendingUp, 
  LuUsers,
  LuCheck,
  LuBell,
  LuArrowRight,
  LuStar
} from "react-icons/lu";
import { toast } from "sonner";

interface CompareComingSoonModalProps {
  triggerText?: React.ReactNode | string;
  btnVariant?: "default" | "link" | "ghost" | "destructive" | "outline" | "secondary";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const CompareComingSoonModal: React.FC<CompareComingSoonModalProps> = ({
  triggerText = "Compare",
  btnVariant = "outline",
  className = "",
  size = "md",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Handle modal open/close
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  // Handle notification subscription
  const handleSubscribe = useCallback(() => {
    setIsSubscribed(true);
    toast.success("Notification Subscribed!", {
      description: "We'll notify you when the Compare feature is ready.",
    });
    
    // Auto-close after delay
    setTimeout(() => {
      setIsOpen(false);
      setIsSubscribed(false);
    }, 3000);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={btnVariant}
          className={`flex items-center gap-2 ${className}`}
        >
          {typeof triggerText === 'string' ? (
            <>
              <span className="text-lg">📊</span>
              {triggerText}
            </>
          ) : (
            triggerText
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent
        className="max-w-[95vw] sm:max-w-lg max-h-[90vh] sm:max-h-[95vh] overflow-hidden rounded-2xl border-0 shadow-2xl mx-2 sm:mx-4"
        aria-label="Compare Feature Coming Soon"
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close modal"
        >
          <LuX className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary" />
        </button>

        <div className="p-4 sm:p-6">
          <DialogHeader className="mb-6 text-center">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-text-primary">
              Compare Feature Coming Soon!
            </DialogTitle>
          </DialogHeader>

          {!isSubscribed ? (
            // Coming Soon Content
            <div className="space-y-6">
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-1 to-primary-2 rounded-full flex items-center justify-center">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Smart College Comparison
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  We're building a powerful comparison tool to help you make informed decisions about your education.
                </p>
              </div>

              {/* Features Preview */}
              <div className="space-y-3">
                <h4 className="font-medium text-text-primary text-center">What to Expect</h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      icon: LuTrendingUp,
                      title: "Side-by-Side Analysis",
                      description: "Compare fees, rankings, placements, and more"
                    },
                    {
                      icon: LuUsers,
                      title: "Student Reviews",
                      description: "Real feedback from current and past students"
                    },
                    {
                      icon: LuCheck,
                      title: "Smart Recommendations",
                      description: "AI-powered suggestions based on your preferences"
                    }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-1 rounded-xl border border-gray-2">
                      <div className="w-8 h-8 bg-primary-1 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <feature.icon className="w-4 h-4 text-primary-main" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-text-primary text-sm">{feature.title}</h5>
                        <p className="text-text-secondary text-xs">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Development Progress</span>
                  <span className="text-primary-main font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-2 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary-main to-primary-4 h-2 rounded-full w-3/4 transition-all duration-1000 ease-out"></div>
                </div>
                <p className="text-xs text-text-secondary text-center">
                  Estimated launch: <span className="text-primary-main font-medium">Q1 2026</span>
                </p>
              </div>

              {/* Call to Action */}
              <div className="space-y-3">
                <Button
                  onClick={handleSubscribe}
                  className="w-full bg-primary-main hover:bg-primary-4 text-white font-medium py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <LuBell className="w-4 h-4 mr-2" />
                  Notify Me When Ready
                </Button>
                <p className="text-xs text-text-secondary text-center">
                  Get early access and exclusive updates
                </p>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-primary-1 to-secondary-1 rounded-xl p-4 border border-primary-light">
                <div className="flex items-center gap-2 mb-2">
                  <LuStar className="w-4 h-4 text-primary-main" />
                  <span className="text-sm font-medium text-primary-main">Pro Tip</span>
                </div>
                <p className="text-xs text-text-secondary">
                  While we build the comparison tool, you can still explore individual college details, 
                  download brochures, and get expert guidance from our team.
                </p>
              </div>
            </div>
          ) : (
            // Success State
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto w-16 h-16 bg-success-1 rounded-full flex items-center justify-center">
                <LuCheck className="w-8 h-8 text-success-main" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-success-main">
                  You're on the list!
                </h3>
                <p className="text-text-secondary text-sm">
                  We'll notify you as soon as the Compare feature is ready. 
                  Get ready to make smarter college decisions!
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-primary-main text-sm">
                <span>Stay tuned for updates</span>
                <LuArrowRight className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompareComingSoonModal;
