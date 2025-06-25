
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Key, Save, ExternalLink } from "lucide-react";
import { AmadeusCredentials } from "@/services/amadeusApi";

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (credentials: AmadeusCredentials) => void;
  currentCredentials?: AmadeusCredentials;
}

const CredentialsModal = ({ isOpen, onClose, onSave, currentCredentials }: CredentialsModalProps) => {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  useEffect(() => {
    if (currentCredentials) {
      setApiKey(currentCredentials.apiKey);
      setApiSecret(currentCredentials.apiSecret);
    }
  }, [currentCredentials]);

  const handleSave = () => {
    if (!apiKey.trim() || !apiSecret.trim()) return;
    
    onSave({
      apiKey: apiKey.trim(),
      apiSecret: apiSecret.trim()
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Amadeus API Credentials
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-800">
              Enter your Amadeus API credentials to fetch real flight data. 
              These will be stored locally in your browser.
            </p>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Amadeus API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-secret">API Secret</Label>
              <Input
                id="api-secret"
                type="password"
                placeholder="Enter your Amadeus API Secret"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => window.open('https://developers.amadeus.com/register', '_blank')}
              className="text-xs"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Get API Keys
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!apiKey.trim() || !apiSecret.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialsModal;
