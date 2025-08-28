"use client";
import React, { useState, useCallback, useMemo } from "react";
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
  LuDownload, 
  LuExternalLink, 
  LuFileText,
  LuEye,
  LuShare2
} from "react-icons/lu";
import { toast } from "sonner";

interface BrochureModalProps {
  brochureUrl?: string;
  collegeName?: string;
  courseName?: string;
  triggerText?: React.ReactNode | string;
  btnVariant?: "default" | "link" | "ghost" | "destructive" | "outline" | "secondary";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const BrochureModal: React.FC<BrochureModalProps> = ({
  brochureUrl,
  collegeName = "College",
  courseName,
  triggerText = "View Brochure",
  btnVariant = "outline",
  className = "",
  size = "lg",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized size classes with mobile optimization
  const sizeClasses = useMemo(() => {
    switch (size) {
      case "sm": return "max-w-[95vw] sm:max-w-md";
      case "md": return "max-w-[95vw] sm:max-w-lg";
      case "lg": return "max-w-[95vw] sm:max-w-4xl";
      case "xl": return "max-w-[95vw] sm:max-w-6xl";
      default: return "max-w-[95vw] sm:max-w-4xl";
    }
  }, [size]);

  // Handle brochure download
  const handleDownload = useCallback(async () => {
    if (!brochureUrl) {
      toast.error("Brochure not available", {
        description: "This brochure is currently not available for download.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(brochureUrl);
      if (!response.ok) throw new Error("Failed to fetch brochure");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${collegeName}_${courseName || 'brochure'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Brochure Downloaded", {
        description: "Your brochure has been downloaded successfully.",
      });
    } catch (error) {
      toast.error("Download Failed", {
        description: "Unable to download brochure. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [brochureUrl, collegeName, courseName]);

  // Handle external link
  const handleExternalLink = useCallback(() => {
    if (brochureUrl) {
      window.open(brochureUrl, '_blank', 'noopener,noreferrer');
      toast.success("Opening Brochure", {
        description: "Brochure opened in new tab.",
      });
    }
  }, [brochureUrl]);

  // Handle share
  const handleShare = useCallback(async () => {
    if (navigator.share && brochureUrl) {
      try {
        await navigator.share({
          title: `${collegeName} Brochure`,
          text: `Check out the brochure for ${collegeName}${courseName ? ` - ${courseName}` : ''}`,
          url: brochureUrl,
        });
      } catch (error) {
        // Fallback to copying URL
        await navigator.clipboard.writeText(brochureUrl);
        toast.success("Link Copied", {
          description: "Brochure link copied to clipboard.",
        });
      }
    } else if (brochureUrl) {
      // Fallback for browsers without share API
      await navigator.clipboard.writeText(brochureUrl);
      toast.success("Link Copied", {
        description: "Brochure link copied to clipboard.",
      });
    }
  }, [brochureUrl, collegeName, courseName]);

  // Check if brochure is available
  const isBrochureAvailable = Boolean(brochureUrl && brochureUrl !== "/");

  // Handle modal open/close
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={btnVariant}
          className={`flex items-center gap-2 ${className}`}
        >
          <LuFileText className="w-4 h-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      
      <DialogContent
        className={`${sizeClasses} max-h-[90vh] sm:max-h-[95vh] overflow-hidden rounded-2xl border-0 shadow-2xl mx-2 sm:mx-4`}
        aria-label="Brochure Viewer"
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close modal"
        >
          <LuX className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary" />
        </button>

        <div className="p-3 sm:p-4 md:p-6">
          <DialogHeader className="mb-4 sm:mb-6">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary text-center">
              {courseName ? `${courseName} at ${collegeName}` : `${collegeName} Brochure`}
            </DialogTitle>
          </DialogHeader>

          {!isBrochureAvailable ? (
            // No brochure available state
            <div className="text-center py-12 space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-2 rounded-full flex items-center justify-center">
                <LuFileText className="w-8 h-8 text-gray-4" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-text-primary">
                  Brochure Not Available
                </h3>
                <p className="text-text-secondary max-w-md mx-auto">
                  The brochure for this {courseName ? 'course' : 'college'} is currently not available. 
                  Please check back later or contact the institution directly.
                </p>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="mt-4"
              >
                Close
              </Button>
            </div>
          ) : (
            // Brochure viewer
            <div className="space-y-4">
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <Button
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-primary-main hover:bg-primary-4 text-white"
                >
                  <LuDownload className="w-4 h-4" />
                  {isLoading ? "Downloading..." : "Download PDF"}
                </Button>
                
                <Button
                  onClick={handleExternalLink}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LuExternalLink className="w-4 h-4" />
                  Open in New Tab
                </Button>
                
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LuShare2 className="w-4 h-4" />
                  Share
                </Button>
              </div>

              {/* Brochure preview */}
              <div className="bg-gray-1 rounded-xl p-4 border border-gray-2">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <LuEye className="w-5 h-5 text-primary-main" />
                  <span className="text-sm font-medium text-text-primary">Brochure Preview</span>
                </div>
                
                {/* PDF Viewer */}
                <div className="w-full h-96 sm:h-[500px] bg-white rounded-lg border border-gray-2 overflow-hidden">
                  {brochureUrl && (
                    <iframe
                      src={`${brochureUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full"
                      title={`${collegeName} Brochure`}
                      loading="lazy"
                    />
                  )}
                </div>
                
                {/* Fallback for non-PDF files */}
                <div className="text-center py-8 text-text-secondary">
                  <p className="text-sm">
                    If the preview doesn't load, you can download the brochure or open it in a new tab.
                  </p>
                </div>
              </div>

              {/* Additional information */}
              <div className="bg-primary-1 rounded-xl p-4 border border-primary-light">
                <h4 className="font-semibold text-primary-main mb-2">Need More Information?</h4>
                <p className="text-sm text-text-secondary mb-3">
                  This brochure contains detailed information about programs, facilities, and admission requirements.
                </p>
                <div className="text-xs text-primary-main space-y-1">
                  <p>• Download for offline reading</p>
                  <p>• Share with family and friends</p>
                  <p>• Compare with other institutions</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BrochureModal;
