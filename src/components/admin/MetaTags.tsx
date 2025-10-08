import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MetaTagsProps {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onMetaKeywordsChange: (keywords: string[]) => void;
  productName?: string;
  productDescription?: string;
}

export const MetaTags = ({
  metaTitle,
  metaDescription,
  metaKeywords,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onMetaKeywordsChange,
  productName,
  productDescription,
}: MetaTagsProps) => {
  const [keywordInput, setKeywordInput] = useState('');

  const autoGenerateMeta = () => {
    if (productName) {
      onMetaTitleChange(`${productName} - Premium Streetwear | No Distraxionz`);
    }
    if (productDescription) {
      const desc = productDescription.slice(0, 155);
      onMetaDescriptionChange(desc);
    }
    
    const autoKeywords = [
      'streetwear',
      'fashion',
      'clothing',
      productName?.toLowerCase(),
    ].filter(Boolean);
    
    onMetaKeywordsChange(autoKeywords as string[]);
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !metaKeywords.includes(keywordInput.trim())) {
      onMetaKeywordsChange([...metaKeywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    onMetaKeywordsChange(metaKeywords.filter(k => k !== keyword));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          <Label className="text-sm font-medium">SEO & Meta Tags</Label>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={autoGenerateMeta}
          className="gap-2 h-7"
        >
          <Sparkles className="h-3 w-3" />
          Auto-generate
        </Button>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Meta Title</Label>
          <Input
            value={metaTitle}
            onChange={(e) => onMetaTitleChange(e.target.value)}
            placeholder="Product name - Brand | Site Name"
            className="h-9 text-sm"
            maxLength={60}
          />
          <p className="text-xs text-muted-foreground">
            {metaTitle.length}/60 characters
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Meta Description</Label>
          <Textarea
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            placeholder="Brief description for search engines"
            rows={3}
            maxLength={160}
          />
          <p className="text-xs text-muted-foreground">
            {metaDescription.length}/160 characters
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Meta Keywords</Label>
          <div className="flex gap-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              placeholder="Add keyword and press Enter"
              className="h-9 text-sm"
            />
            <Button
              type="button"
              onClick={addKeyword}
              variant="outline"
              className="h-9"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {metaKeywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-destructive/10"
                onClick={() => removeKeyword(keyword)}
              >
                {keyword}
                <span className="text-xs">×</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Optimized meta tags help your products rank better in search engines.
      </p>
    </div>
  );
};
