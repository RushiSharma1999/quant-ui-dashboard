"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Database,
  Upload,
  HelpCircle,
  Settings,
  Loader2,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

const SAMPLE_REPORTS = [
  { id: "1", name: "Sales Summary" },
  { id: "2", name: "Inventory Valuation" },
  { id: "3", name: "Restock Forecast" },
  { id: "4", name: "Slow Movers" },
  { id: "5", name: "Purchase Orders" },
  { id: "6", name: "Stock Levels" },
  { id: "7", name: "Vendor Performance" },
  { id: "8", name: "Cost Analysis" },
]

export default function QuantUIPage() {
  const { toast } = useToast()
  const [selectedReport, setSelectedReport] = useState<string>("")
  const [autoDownloads, setAutoDownloads] = useState(false)
  const [leftDownloadProgress, setLeftDownloadProgress] = useState(0)
  const [isLeftDownloading, setIsLeftDownloading] = useState(false)
  const [rightDownloadProgress, setRightDownloadProgress] = useState(0)
  const [isRightDownloading, setIsRightDownloading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [schedule, setSchedule] = useState({ frequency: "daily", time: "09:00" })

  const handleDownloadReport = async () => {
    if (!selectedReport) {
      toast({
        title: "No report selected",
        description: "Please select a report to download.",
        variant: "destructive",
      })
      return
    }

    setIsLeftDownloading(true)
    setLeftDownloadProgress(0)

    const interval = setInterval(() => {
      setLeftDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsLeftDownloading(false)
          toast({
            title: "Download complete",
            description: `${SAMPLE_REPORTS.find((r) => r.id === selectedReport)?.name} has been downloaded successfully.`,
          })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleMasterDownload = () => {
    setShowConfirmModal(true)
  }

  const confirmMasterDownload = async () => {
    setShowConfirmModal(false)
    setIsRightDownloading(true)
    setRightDownloadProgress(0)

    const interval = setInterval(() => {
      setRightDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRightDownloading(false)
          toast({
            title: "Master database downloaded",
            description: "The complete master dataset has been exported successfully.",
          })
          return 100
        }
        return prev + 5
      })
    }, 300)
  }

  const handleScheduleChange = () => {
    setShowScheduleModal(false)
    toast({
      title: "Schedule updated",
      description: `Auto downloads set to ${schedule.frequency} at ${schedule.time}.`,
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.match(/\.(csv|xlsx)$/i)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or XLSX file.",
        variant: "destructive",
      })
      return
    }

    setUploadedFile(file)
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          toast({
            title: "Upload successful",
            description: `${Math.floor(Math.random() * 500 + 100)} records added/updated from ${file.name}.`,
          })
          return 100
        }
        return prev + 8
      })
    }, 150)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-slate-900">Quant UI</h1>
            <Button variant="ghost" size="sm">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">Query Box</h2>
                <p className="text-sm text-slate-600">List of reports</p>
              </div>

              <div className="space-y-4">
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a report..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SAMPLE_REPORTS.map((report) => (
                      <SelectItem key={report.id} value={report.id}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {report.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleDownloadReport}
                  disabled={!selectedReport || isLeftDownloading}
                  className="w-full"
                >
                  {isLeftDownloading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download
                </Button>

                {isLeftDownloading && (
                  <div className="space-y-2">
                    <Progress value={leftDownloadProgress} className="w-full" />
                    <p className="text-sm text-slate-600 text-center">Downloading... {leftDownloadProgress}%</p>
                  </div>
                )}
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-downloads" className="text-sm font-medium">
                      Auto downloads
                    </Label>
                    <Switch id="auto-downloads" checked={autoDownloads} onCheckedChange={setAutoDownloads} />
                  </div>
                  <p className="text-xs text-slate-600">Automatically download the selected report on a schedule</p>
                </CardHeader>
                {autoDownloads && (
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {schedule.frequency} at {schedule.time}
                      </Badge>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={() => setShowScheduleModal(true)}
                      >
                        Change
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Inventory Database</h2>
              </div>

              <div className="space-y-4">
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <Database className="h-5 w-5" />
                      <Download className="h-4 w-4" />
                      Download Master Database
                    </CardTitle>
                    <CardDescription className="text-red-600">Export the entire master dataset</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
                      onClick={handleMasterDownload}
                      disabled={isRightDownloading}
                    >
                      {isRightDownloading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Database className="h-4 w-4 mr-2" />
                      )}
                      Download Master DB
                    </Button>

                    {isRightDownloading && (
                      <div className="space-y-2 mt-4">
                        <Progress value={rightDownloadProgress} className="w-full" />
                        <p className="text-sm text-red-600 text-center">Downloading... {rightDownloadProgress}%</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <Upload className="h-5 w-5" />
                      Upload New Data
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Import CSV or XLSX files to update inventory
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <p className="text-sm text-green-700 mb-2">Drag and drop your file here, or</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                        onClick={() => document.getElementById("file-upload")?.click()}
                        disabled={isUploading}
                      >
                        Choose file
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".csv,.xlsx"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>

                    {uploadedFile && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{uploadedFile.name}</span>
                          <span className="text-slate-500">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        {isUploading && (
                          <div className="space-y-1">
                            <Progress value={uploadProgress} className="w-full" />
                            <p className="text-xs text-green-600">Uploading... {uploadProgress}%</p>
                          </div>
                        )}
                        {uploadProgress === 100 && !isUploading && (
                          <div className="flex items-center gap-2 text-sm text-green-700">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Upload complete</span>
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                              View import log
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Confirm Master Database Download
            </DialogTitle>
            <DialogDescription>
              This will download the entire master dataset. This is a large file and may take several minutes to
              complete.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmMasterDownload}>Continue Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Schedule Settings
            </DialogTitle>
            <DialogDescription>Configure when to automatically download the selected report.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={schedule.frequency}
                onValueChange={(value) => setSchedule((prev) => ({ ...prev, frequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Select
                value={schedule.time}
                onValueChange={(value) => setSchedule((prev) => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleChange}>Save Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
