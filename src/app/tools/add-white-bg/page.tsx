'use client';

import { Navbar } from '@/components/Navbar';
import { ImageUploader } from '@/components/tools/add-white-bg/ImageUploader';
import { ImageCardGrid } from '@/components/tools/add-white-bg/ImageCardGrid';
import { SettingsPanel } from '@/components/tools/add-white-bg/SettingsPanel';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { Button } from '@/components/ui/button';
import { Play, Download, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AddWhiteBgPage() {
  const {
    images,
    settings,
    isProcessing,
    setSettings,
    addImages,
    removeImage,
    processAll,
    downloadCompleted,
  } = useImageProcessor();

  const completedCount = images.filter((img) => img.status === 'Done' && img.processedBlob).length;
  const waitingCount = images.filter((img) => img.status === 'Waiting').length;

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] bg-gray-50/30 dark:bg-gray-950/30 px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-4 font-medium">
              Image Processing Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
              Add Background to Images
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Easily add custom colored backgrounds and padding to your transparent images. 
              Optionally remove the original background first using AI magic.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-3 space-y-8 flex flex-col">
              <ImageUploader onUpload={addImages} />
              
              {images.length > 0 && (
                <Card className="border-none shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 dark:border-gray-800 pb-6 mb-6 gap-4">
                      <div>
                        <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                          Uploaded Images
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {images.length} file{images.length === 1 ? '' : 's'} ready for processing
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                        <Button
                          onClick={processAll}
                          disabled={isProcessing || waitingCount === 0}
                          className="flex-1 sm:flex-none shadow-sm"
                          size="lg"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Process All
                            </>
                          )}
                        </Button>
                        
                        {completedCount > 0 && (
                          <Button
                            onClick={downloadCompleted}
                            variant="secondary"
                            className="flex-1 sm:flex-none bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-900/40 border border-green-200 dark:border-green-900/50 shadow-sm"
                            size="lg"
                          >
                            <Download className="w-4 h-4 mr-2" /> 
                            Download All ({completedCount})
                          </Button>
                        )}
                      </div>
                    </div>

                    <ImageCardGrid
                      images={images}
                      onRemove={removeImage}
                      format={settings.format}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1 w-full">
              <SettingsPanel
                settings={settings}
                setSettings={setSettings}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
