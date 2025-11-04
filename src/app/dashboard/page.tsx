"use client";
import React, { useState } from 'react';
import { 
  Plus, 
  Brain, 
  FileText, 
  Star, 
  Settings, 
  HelpCircle, 
  Upload, 
  Search,
  Crown,
  Clock,
  Trash2,
  Share2,
  Download,
  Eye,
  MoreHorizontal,
  Sparkles,
  X,
  Lightbulb,
  Activity,
  Edit3,
  RotateCcw,
  Layout,
  Zap,
  Copy
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarProvider, 
  SidebarTrigger 
} from '@/components/ui/sidebar';


interface MindMap {
  id: string;
  title: string;
  description: string;
  lastModified: string;
  nodeCount: number;
  isFavorite: boolean;
  thumbnail: string;
}

interface RecentActivity {
  id: string;
  type: 'created' | 'edited' | 'shared' | 'exported' | 'favorited';
  title: string;
  description: string;
  timestamp: string;
  icon: any;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  
  // Mock data for demonstration
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'created',
      title: 'Created "Project Planning Strategy"',
      description: 'New mind map with 23 nodes',
      timestamp: '2 hours ago',
      icon: Plus
    },
    {
      id: '2',
      type: 'edited',
      title: 'Updated "Marketing Campaign Ideas"',
      description: 'Added 5 new nodes and restructured layout',
      timestamp: '4 hours ago',
      icon: Edit3
    },
    {
      id: '3',
      type: 'shared',
      title: 'Shared "Learning Path: AI & ML"',
      description: 'Shared with team@company.com',
      timestamp: '1 day ago',
      icon: Share2
    },
    {
      id: '4',
      type: 'exported',
      title: 'Exported "Product Roadmap"',
      description: 'Downloaded as PDF format',
      timestamp: '2 days ago',
      icon: Download
    },
    {
      id: '5',
      type: 'favorited',
      title: 'Added to favorites',
      description: '"Customer Journey Map" marked as favorite',
      timestamp: '3 days ago',
      icon: Star
    }
  ];

  const recentMaps: MindMap[] = [
    {
      id: '1',
      title: 'Project Planning Strategy',
      description: 'Comprehensive project roadmap and milestone planning',
      lastModified: '2 hours ago',
      nodeCount: 23,
      isFavorite: true,
      thumbnail: 'blue'
    },
    {
      id: '2', 
      title: 'Marketing Campaign Ideas',
      description: 'Creative concepts for Q1 marketing initiatives',
      lastModified: '1 day ago',
      nodeCount: 15,
      isFavorite: false,
      thumbnail: 'purple'
    },
    {
      id: '3',
      title: 'Learning Path: AI & ML',
      description: 'Structured approach to learning artificial intelligence',
      lastModified: '3 days ago', 
      nodeCount: 31,
      isFavorite: true,
      thumbnail: 'green'
    }
  ];

  const handleCreateAction = (action: string) => {
    console.log('Create action:', action);
    setShowCreateOptions(false);
    // Handle create actions here
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Brain, active: true },
    { id: 'my-maps', label: 'My Mind Maps', icon: FileText },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Docs', icon: HelpCircle },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-4 py-3">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h2 className="font-medium">Manaska</h2>
                <p className="text-xs text-muted-foreground">Mind Map Generator</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            
            <Separator className="my-4" />
            
            {/* Upgrade Section */}
            <div className="px-4">
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Upgrade to Pro</span>
                  </div>
                  <p className="text-xs text-yellow-700 mb-3">
                    Unlock unlimited mind maps and AI features
                  </p>
                  <Button size="sm" className="w-full bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 hover:from-yellow-200 hover:to-orange-200 border border-yellow-200">
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6 justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-xl font-medium">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Welcome back! Ready to create something amazing?</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search mind maps..." 
                    className="w-64 pl-9"
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/user.jpg" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">John Doe</p>
                        <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 p-6 space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Welcome back, John! 👋
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Ready to organize your thoughts and create amazing mind maps? You have 3 AI generations remaining this month.
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <Button variant="outline" className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Lightbulb className="h-4 w-4" />
                    View Tips
                  </Button>
                  <Button className="gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200 border border-blue-200">
                    <Sparkles className="h-4 w-4" />
                    Start Creating
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Mind Maps</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+3 from last week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">Most used maps</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Generations</CardTitle>
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-muted-foreground">3 remaining this month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4GB</div>
                  <Progress value={48} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">48% of 5GB limit</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity and Recent Mind Maps - Optimized Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Recent Activity Section */}
              <Card className="xl:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest actions and changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                          <activity.icon className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{activity.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{activity.description}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        View All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Mind Maps Section */}
              <Card className="xl:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Recent Mind Maps
                      </CardTitle>
                      <CardDescription>Continue working on your latest projects</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">View All</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentMaps.map((map) => (
                      <div key={map.id} className="group cursor-pointer hover:bg-blue-50/30 transition-colors rounded-lg p-3 border border-transparent hover:border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className={`w-20 h-14 rounded-md overflow-hidden flex-shrink-0 ring-1 ring-blue-100 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
                            map.thumbnail === 'blue' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                            map.thumbnail === 'purple' ? 'bg-gradient-to-br from-purple-100 to-purple-200' :
                            map.thumbnail === 'green' ? 'bg-gradient-to-br from-green-100 to-green-200' :
                            'bg-gradient-to-br from-gray-100 to-gray-200'
                          }`}>
                            <Brain className={`h-6 w-6 ${
                              map.thumbnail === 'blue' ? 'text-blue-600' :
                              map.thumbnail === 'purple' ? 'text-purple-600' :
                              map.thumbnail === 'green' ? 'text-green-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1 flex-1">
                                <h3 className="text-sm font-medium line-clamp-1">{map.title}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">{map.description}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {map.lastModified}
                                  <span>•</span>
                                  <span>{map.nodeCount} nodes</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                {map.isFavorite && (
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Star className="mr-2 h-3 w-3" />
                                      {map.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Share2 className="mr-2 h-3 w-3" />
                                      Share
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="mr-2 h-3 w-3" />
                                      Export
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash2 className="mr-2 h-3 w-3" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Simplified Floating Action Button */}
            <div className="fixed bottom-8 right-8 z-50">
              <div className="relative">
                {/* Create Options */}
                {showCreateOptions && (
                  <div className="absolute bottom-20 right-0 space-y-3 mb-2">
                    <div className="flex flex-col items-end space-y-3">
                      {/* Generate with AI */}
                      <div className="group flex items-center">
                        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg mr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm whitespace-nowrap text-gray-700">Generate with AI</span>
                        </div>
                        <Button
                          size="lg"
                          className="rounded-full h-12 w-12 shadow-lg bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-200 transform hover:scale-110 transition-all duration-200"
                          onClick={() => handleCreateAction('generate-ai')}
                        >
                          <Sparkles className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      {/* Create from Template */}
                      <div className="group flex items-center">
                        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg mr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm whitespace-nowrap text-gray-700">Create from Template</span>
                        </div>
                        <Button
                          size="lg"
                          className="rounded-full h-12 w-12 shadow-lg bg-purple-100 hover:bg-purple-200 text-purple-600 border border-purple-200 transform hover:scale-110 transition-all duration-200"
                          onClick={() => handleCreateAction('template')}
                        >
                          <Layout className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      {/* Import Mind Map */}
                      <div className="group flex items-center">
                        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg mr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm whitespace-nowrap text-gray-700">Import Mind Map</span>
                        </div>
                        <Button
                          size="lg"
                          className="rounded-full h-12 w-12 shadow-lg bg-green-100 hover:bg-green-200 text-green-600 border border-green-200 transform hover:scale-110 transition-all duration-200"
                          onClick={() => handleCreateAction('import')}
                        >
                          <Upload className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Main FAB */}
                <Button
                  size="lg"
                  className={`rounded-full h-16 w-16 shadow-xl transform transition-all duration-400 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${
                    showCreateOptions 
                      ? 'bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 scale-110' 
                      : 'bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 text-blue-600 border border-blue-200 hover:scale-110'
                  }`}
                  onClick={() => {
                    setShowCreateOptions(prev => !prev);
                  }}
                >
                  <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
                    <Plus 
                      className={`absolute h-6 w-6 transition-all duration-400 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${
                        showCreateOptions 
                          ? 'opacity-0 rotate-180 scale-75 translate-y-1' 
                          : 'opacity-100 rotate-0 scale-100 translate-y-0'
                      }`} 
                    />
                    <X 
                      className={`absolute h-6 w-6 transition-all duration-400 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${
                        showCreateOptions 
                          ? 'opacity-100 rotate-0 scale-100 translate-y-0' 
                          : 'opacity-0 rotate-180 scale-75 translate-y-1'
                      }`} 
                    />
                  </div>
                </Button>
              </div>
            </div>


          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}