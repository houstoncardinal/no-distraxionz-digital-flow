import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Star,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Check,
  X,
  Flag,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { format } from 'date-fns';

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    productName: 'Tunnel Vision Tee',
    productId: '1',
    rating: 5,
    title: 'Amazing quality!',
    content: 'Love this shirt! The quality is excellent and the design is exactly what I was looking for. Will definitely order again.',
    status: 'approved',
    createdAt: '2024-01-15T10:30:00Z',
    helpful: 12,
    verified: true,
  },
  {
    id: '2',
    customerName: 'Mike Chen',
    customerEmail: 'mike.c@email.com',
    productName: 'Legendary Heavyweight',
    productId: '2',
    rating: 4,
    title: 'Great fit',
    content: 'Good quality shirt, fits well. The material is comfortable and the print looks great.',
    status: 'pending',
    createdAt: '2024-01-14T15:45:00Z',
    helpful: 8,
    verified: true,
  },
  {
    id: '3',
    customerName: 'Emma Davis',
    customerEmail: 'emma.d@email.com',
    productName: 'Time Is Money Tee',
    productId: '3',
    rating: 2,
    title: 'Not as expected',
    content: 'The shirt arrived with a small defect and the sizing was off. Customer service was helpful though.',
    status: 'pending',
    createdAt: '2024-01-13T09:20:00Z',
    helpful: 3,
    verified: true,
  },
  {
    id: '4',
    customerName: 'Alex Rodriguez',
    customerEmail: 'alex.r@email.com',
    productName: 'No More Fake Friends T-Shirt',
    productId: '4',
    rating: 5,
    title: 'Perfect!',
    content: 'Exactly what I ordered. Fast shipping and great quality. Highly recommend!',
    status: 'approved',
    createdAt: '2024-01-12T14:10:00Z',
    helpful: 15,
    verified: true,
  },
  {
    id: '5',
    customerName: 'Lisa Wang',
    customerEmail: 'lisa.w@email.com',
    productName: 'Why Be Average, Be Legendary',
    productId: '5',
    rating: 1,
    title: 'Poor quality',
    content: 'The shirt faded after one wash and the print started peeling. Very disappointed.',
    status: 'flagged',
    createdAt: '2024-01-11T16:30:00Z',
    helpful: 1,
    verified: false,
  },
];

const Reviews = () => {
  const [reviews] = useState(mockReviews);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const filtered = useMemo(() => {
    let filtered = reviews;
    
    // Search filter
    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((r) =>
        r.customerName.toLowerCase().includes(q) || 
        r.productName.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q)
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }
    
    // Rating filter
    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter((r) => r.rating === rating);
    }
    
    return filtered;
  }, [reviews, query, statusFilter, ratingFilter]);

  const reviewStats = useMemo(() => {
    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter(r => r.status === 'approved').length;
    const pendingReviews = reviews.filter(r => r.status === 'pending').length;
    const flaggedReviews = reviews.filter(r => r.status === 'flagged').length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    
    return {
      totalReviews,
      approvedReviews,
      pendingReviews,
      flaggedReviews,
      averageRating,
    };
  }, [reviews]);

  const handleViewReview = (review: any) => {
    setSelectedReview(review);
    setViewOpen(true);
  };

  const handleApproveReview = (reviewId: string) => {
    // In a real app, this would update the review status
    console.log('Approving review:', reviewId);
  };

  const handleRejectReview = (reviewId: string) => {
    // In a real app, this would update the review status
    console.log('Rejecting review:', reviewId);
  };

  const handleFlagReview = (reviewId: string) => {
    // In a real app, this would flag the review
    console.log('Flagging review:', reviewId);
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = 'text-primary',
    trend = null 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    color?: string;
    trend?: { value: number; isPositive: boolean } | null;
  }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-muted/50 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Review Management</h1>
          <p className="text-muted-foreground">Moderate and manage customer reviews</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reviews"
          value={reviewStats.totalReviews}
          icon={MessageSquare}
          color="text-blue-600"
        />
        <StatCard
          title="Approved"
          value={reviewStats.approvedReviews}
          subtitle={`${Math.round((reviewStats.approvedReviews / reviewStats.totalReviews) * 100)}% of total`}
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Pending"
          value={reviewStats.pendingReviews}
          subtitle="Awaiting moderation"
          icon={Clock}
          color="text-yellow-600"
        />
        <StatCard
          title="Average Rating"
          value={reviewStats.averageRating.toFixed(1)}
          subtitle="Out of 5 stars"
          icon={Star}
          color="text-purple-600"
        />
      </div>

      {/* Rating Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(r => r.rating === rating).length;
            const percentage = (count / reviews.length) * 100;
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(rating)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reviews..."
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b">
          <div className="text-sm text-muted-foreground">
            {filtered.length} reviews
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((review) => (
                  <TableRow key={review.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {review.customerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{review.customerName}</div>
                          {review.verified && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{review.productName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium text-sm">{review.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {review.content}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {review.status === 'approved' ? (
                        <Badge variant="default" className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      ) : review.status === 'pending' ? (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <Flag className="h-3 w-3 mr-1" />
                          Flagged
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewReview(review)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {review.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600"
                              onClick={() => handleApproveReview(review.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => handleRejectReview(review.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewReview(review)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {review.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleApproveReview(review.id)}>
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {review.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleRejectReview(review.id)}>
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleFlagReview(review.id)}>
                              <Flag className="h-4 w-4 mr-2" />
                              Flag
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Review Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Review Details
            </DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <span className="text-sm font-medium">{selectedReview.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="text-sm">{selectedReview.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Verified:</span>
                      <Badge variant={selectedReview.verified ? "default" : "outline"}>
                        {selectedReview.verified ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Review Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Product:</span>
                      <span className="text-sm font-medium">{selectedReview.productName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Rating:</span>
                      <div className="flex items-center gap-1">
                        {renderStars(selectedReview.rating)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Date:</span>
                      <span className="text-sm">
                        {format(new Date(selectedReview.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Helpful:</span>
                      <span className="text-sm">{selectedReview.helpful} votes</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Review Content</h3>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">{selectedReview.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {selectedReview.content}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Moderation Actions</h3>
                <div className="flex items-center gap-2">
                  {selectedReview.status === 'pending' && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApproveReview(selectedReview.id)}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRejectReview(selectedReview.id)}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFlagReview(selectedReview.id)}
                    className="gap-2"
                  >
                    <Flag className="h-4 w-4" />
                    Flag
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Reply to Review</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="reply">Your Reply</Label>
                    <Textarea
                      id="reply"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a response to this review..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm">Send Reply</Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reviews;