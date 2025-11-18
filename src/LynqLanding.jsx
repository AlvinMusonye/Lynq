import React, { useState } from 'react';
import { Upload, Wand2, CheckCircle, Download, Eye, Zap, Shield, Sparkles, FileText, BarChart3, Menu, X } from 'lucide-react';


  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: 'Lora, serif' }}>
      {/* Navigation */}


      {/* Hero Section with iPhone Mockup */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Clean Your CSVs

              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                in Seconds
              </span>
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
              Fix messy data instantly. Upload, clean, transform,
              and export — all in one place.

            </p>

                Start Cleaning
              </button>
              <button onClick={onStart} className="bg-white text-blue-600 px-8 py-4 rounded-full text-base font-medium border-2 border-blue-200 hover:border-blue-400 transition-all">
                Try Demo
              </button>
            </div>

            {/* Feature Cards Below Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-md border border-blue-100">
                <div className="bg-blue-50 rounded-2xl w-12 h-12 flex items-center justify-center mb-4 shadow-sm">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Smart Auto-Clean</h3>
                <p className="text-sm text-gray-700">Remove duplicates, empty rows, and formatting problems instantly</p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-md border border-blue-100">
                <div className="bg-blue-50 rounded-2xl w-12 h-12 flex items-center justify-center mb-4 shadow-sm">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Live Data Preview</h3>
                <p className="text-sm text-gray-700">See results before you export with real-time visualization</p>
              </div>
            </div>
          </div>

          {/* Right - iPhone Mockup */}
          <div className="relative">
            {/* Main iPhone */}
            <div className="relative z-10 mx-auto w-[280px]">
              {/* iPhone Frame */}
              <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-white px-6 py-3 flex justify-between items-center text-xs">
                    <span className="font-semibold">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-4 rounded-sm border border-gray-400"></div>
                      <div className="h-3 w-1 rounded-sm bg-gray-400"></div>

                    </div>
                  </div>

                  {/* Screen Content */}
                  <div className="bg-gradient-to-br from-blue-50 to-white px-4 py-4" style={{ height: '520px' }}>
                    {/* Header (Phone screen content) */}
                    <div className="mb-4">
                      <div className="text-[10px] text-gray-500 mb-1">Welcome to</div>
                      <div className="text-lg font-bold mb-3">Lynq CSV Cleaner ✨</div>
                      
                      {/* Primary Card */}
                      <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-4 text-white shadow-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="text-[10px] opacity-90 mb-1">Upload Status</div>
                            <div className="text-sm font-semibold">Ready to Clean</div>
                          </div>
                          <Upload className="w-5 h-5 opacity-80" />
                        </div>
                        <div className="text-[10px] opacity-90 mb-1">Last Upload</div>
                        <div className="text-xs font-semibold">customers_2024.csv</div>
                      </div>
                    </div>

                    {/* Task List */}
                    <div className="space-y-2">
                      <div className="bg-white/70 backdrop-blur-md rounded-xl p-3 flex items-center gap-2.5 shadow-sm border border-white/20">
                        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-lg w-8 h-8 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-[13px]">Remove Duplicates</div>
                          <div className="text-[11px] text-gray-500">147 removed</div>
                        </div>
                        <div className="text-[11px] text-green-600 font-semibold">Done</div>
                      </div>

                      <div className="bg-white/70 backdrop-blur-md rounded-xl p-3 flex items-center gap-2.5 shadow-sm border border-white/20">
                        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg w-8 h-8 flex items-center justify-center">
                          <Wand2 className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-[13px]">Standardize Emails</div>
                          <div className="text-[11px] text-gray-500">Processing...</div>
                        </div>
                        <div className="text-[11px] text-blue-600 font-semibold">80%</div>
                      </div>

                      <div className="bg-white/70 backdrop-blur-md rounded-xl p-3 flex items-center gap-2.5 shadow-sm border border-white/20">
                        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg w-8 h-8 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-[13px]">Validate Data</div>
                          <div className="text-[11px] text-gray-500">12 issues found</div>
                        </div>
                        <div className="text-[11px] text-orange-600 font-semibold">Review</div>
                      </div>

                      <div className="bg-white/70 backdrop-blur-md rounded-xl p-3 flex items-center gap-2.5 shadow-sm border border-white/20">
                        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg w-8 h-8 flex items-center justify-center">
                          <Download className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-[13px]">Export Clean CSV</div>
                          <div className="text-[11px] text-gray-500">Ready to download</div>
                        </div>
                        <div className="text-[11px] text-gray-400">Pending</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Nav */}
                  <div className="bg-white px-6 py-4 flex justify-around border-t">
                  <div className="h-1 w-8 rounded-full bg-blue-600"></div>
                    <div className="h-1 w-8 rounded-full bg-gray-300"></div>
                    <div className="h-1 w-8 rounded-full bg-gray-300"></div>

                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards Around iPhone */}
            

            <div className="hidden lg:block absolute bottom-32 -left-12 bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20" style={{ width: '160px' }}>
              <div className="text-2xl font-bold text-blue-600 mb-1">100%</div>
              <div className="text-xs text-gray-600 mb-2">Browser-based</div>
              <div className="text-xs text-gray-500">No install needed</div>
            </div>

            <div className="hidden lg:block absolute top-1/2 -right-20 bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20" style={{ width: '160px' }}>
              <div className="font-semibold text-sm mb-2">Live Preview</div>
              <div className="text-xs text-gray-500 mb-3">See changes before exporting</div>
              <div className="flex gap-1">
                <div className="flex-1 h-2 bg-blue-200 rounded-full"></div>
                <div className="flex-1 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">Save Hours</div>
            <div className="text-gray-600">of manual cleaning</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">Zero Errors</div>
            <div className="text-gray-600">Eliminate human mistakes</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">Any Size</div>
            <div className="text-gray-600">Works with large CSV files</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">Easy to Use</div>
            <div className="text-gray-600">Built for non-technical users</div>
          </div>
        </div>
      </section>

      {/* Features Section with Cards */}
      <section id="features" className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          Comprehensive <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Feature Set</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to clean your data</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            {/* Left Side - Feature Cards */}
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Smart Cleaning</h3>
                    <p className="text-gray-600">Automatically removes duplicates, empty rows, extra spaces, and formatting issues.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4">
                    <Wand2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Transform Columns</h3>
                    <p className="text-gray-600">Standardize dates, emails, phone numbers, text casing, and more with one click.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Data Validation</h3>
                    <p className="text-gray-600">Detect invalid emails, numbers, missing values, or wrong formats instantly.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Large Feature Cards */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">One-Click Export</h3>
                </div>
                <p className="text-blue-100 mb-6">Download a clean, ready-to-use CSV instantly. No hassle, no waiting.</p>
                <div className="bg-white/20 rounded-2xl p-4 backdrop-blur">
                  <div className="text-sm opacity-90 mb-2">Export Format</div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-white/30 rounded-full text-xs">CSV</div>
                    <div className="px-3 py-1 bg-white/30 rounded-full text-xs">Excel</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-3">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold">No Setup Needed</h3>
                </div>
                <p className="text-gray-600 mb-4">100% browser-based. Nothing to install. Works on any device, anywhere.</p>
                <div className="flex gap-2">
                  <div className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">Web-based</div>
                  <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Secure</div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-3">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold">Live Preview</h3>
                </div>
                <p className="text-gray-600">See changes before exporting. Review and confirm every transformation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-lg sm:text-xl text-gray-600">Clean data in 3 simple steps</p>

        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="bg-gradient-to-br from-blue-600 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                1
              </div>
              <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Upload Your CSV</h3>
              <p className="text-gray-600">Drag & drop or select a file from your computer</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="bg-gradient-to-br from-blue-600 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                2
              </div>
              <Wand2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Review & Auto-Clean</h3>
              <p className="text-gray-600">Lynq detects issues and suggests fixes automatically</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="bg-gradient-to-br from-blue-600 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                3
              </div>
              <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Download Clean Data</h3>
              <p className="text-gray-600">Export your cleaned CSV in seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section with iPhone */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-[3rem] overflow-hidden relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center p-8 sm:p-12 lg:p-20">
        {/* Left Content */}
        <div className="text-white text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Ready? Let's Start with Lynq

                and Get Awesome Experience
              </h2>
              <p className="text-blue-100 mb-8 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                Upload your messy CSV files and let Lynq handle the rest.

                Clean, transform, and export your data in just a few clicks.
              </p>
              <button onClick={onStart} className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all">
                Start Cleaning →
              </button>
            </div>

            {/* Right - iPhone Mockup */}
            <div className="relative hidden lg:block">
              <div className="relative z-10" style={{ width: '240px', margin: '0 auto' }}>
                <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                  <div className="bg-white rounded-[2rem] overflow-hidden">
                    <div className="bg-gradient-to-br from-blue-50 to-white p-6" style={{ height: '480px' }}>
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-lg">CSV Cleaning</h3>
                        <p className="text-xs text-gray-500 mt-2">Transform your data instantly</p>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-4 shadow-sm border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <div className="text-sm font-semibold">Duplicates Removed</div>
                          </div>
                          <div className="text-xs text-gray-500">147 rows cleaned</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-4 shadow-sm border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Wand2 className="w-4 h-4 text-blue-600" />
                            <div className="text-sm font-semibold">Emails Standardized</div>
                          </div>
                          <div className="text-xs text-gray-500">All lowercase</div>
                        </div>
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/20">
                          <div className="flex items-center gap-2 mb-1">
                            <Download className="w-4 h-4 text-blue-600" />
                            <div className="text-sm font-semibold">Ready to Export</div>
                          </div>
                          <div className="text-xs text-blue-600">Click to download</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
        <div>
              <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                Lynq
              </div>
              <p className="text-gray-400 text-sm">Clean CSVs in seconds</p>
            </div>
            <div>
            <h4 className="font-bold mb-4 text-white">Product</h4>
            <div className="space-y-2 text-gray-400 text-sm">
                <div><a href="#features" className="hover:text-white transition-colors">Features</a></div>
                <div><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Docs</a></div>
              </div>
            </div>
            <div>
            <h4 className="font-bold mb-4 text-white">Company</h4>
            <div className="space-y-2 text-gray-400 text-sm">
                <div><a href="#about" className="hover:text-white transition-colors">About</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Contact</a></div>
                <div><a href="#" className="hover:text-white transition-colors">GitHub</a></div>
              </div>
            </div>
            <div>
            <h4 className="font-bold mb-4 text-white">Legal</h4>
            <div className="space-y-2 text-gray-400 text-sm">
                <div><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Terms of Service</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Lynq. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
