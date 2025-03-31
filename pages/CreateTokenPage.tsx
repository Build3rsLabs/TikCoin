import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Slider } from '../components/ui/slider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Info, HelpCircle } from 'lucide-react';
import LineChart from '../components/LineChart';

// Form validation schema
const formSchema = z.object({
  tokenName: z.string().min(1, 'Token name is required').max(50, 'Token name cannot exceed 50 characters'),
  tokenSymbol: z.string().min(1, 'Token symbol is required').max(10, 'Token symbol cannot exceed 10 characters'),
  initialPrice: z.coerce.number().positive('Initial price must be positive'),
  creatorFee: z.coerce.number().min(0, 'Creator fee cannot be negative').max(10, 'Creator fee cannot exceed 10%'),
  curveSlope: z.coerce.number().positive('Curve slope must be positive'),
  initialSupply: z.coerce.number().int().positive('Initial supply must be a positive integer'),
});

type FormValues = z.infer<typeof formSchema>;

const CreateTokenPage = () => {
  const [previewData, setPreviewData] = useState<{ x: number; y: number }[]>([]);
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenName: '',
      tokenSymbol: '',
      initialPrice: 0.01,
      creatorFee: 2.5,
      curveSlope: 0.1,
      initialSupply: 1000,
    },
  });

  const watchedValues = form.watch();

  // Generate preview data when parameters change
  useEffect(() => {
    const { initialPrice, curveSlope, initialSupply } = watchedValues;
    
    if (!initialPrice || !curveSlope || !initialSupply) return;
    
    // Generate data points for token price curve preview
    const data = [];
    for (let i = 0; i <= initialSupply * 2; i += initialSupply / 10) {
      // Linear bonding curve: price = initialPrice + (supply * slope)
      const price = initialPrice + (i * curveSlope);
      data.push({ x: i, y: price });
    }
    setPreviewData(data);
  }, [watchedValues.initialPrice, watchedValues.curveSlope, watchedValues.initialSupply]);

  const onSubmit = async (data: FormValues) => {
    console.log('Form submitted:', data);
    // This will be integrated with Stellar SDK to create the token
    try {
      // Call to create token would go here
      alert('Token creation initiated. Check your wallet to confirm the transaction.');
    } catch (error) {
      console.error('Error creating token:', error);
      alert('Failed to create token. Please try again.');
    }
  };

  // Calculate market cap and other metrics for preview
  const estimatedMarketCap = watchedValues.initialPrice * watchedValues.initialSupply;
  const creatorReserve = watchedValues.initialSupply * 0.1; // 10% creator reserve
  const estimatedFeeRevenue = estimatedMarketCap * (watchedValues.creatorFee / 100);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create Your Creator Token</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Token Configuration</CardTitle>
            <CardDescription>Set the parameters for your creator token</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="tokenName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Token Name
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">The name of your creator token, typically your brand or name.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Alex Creator Token" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tokenSymbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Token Symbol
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">A short ticker symbol for your token, usually 3-5 characters.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. ACT" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="initialPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Initial Price (XLM)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">The starting price of your token in XLM. Lower prices make it easier for fans to start supporting you.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="initialSupply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Initial Supply
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">The initial number of tokens available. Determines how fast the price increases as people buy.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="curveSlope"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Bonding Curve Slope
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Determines how quickly your token price increases as more tokens are purchased. Higher values mean steeper price growth.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <div className="pt-2">
                          <Slider
                            defaultValue={[0.1]}
                            min={0.01}
                            max={0.5}
                            step={0.01}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-right">{field.value}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="creatorFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Creator Fee (%)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Percentage you earn from each transaction. Higher fees generate more revenue but might discourage trading.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <div className="pt-2">
                          <Slider
                            defaultValue={[2.5]}
                            min={0}
                            max={10}
                            step={0.5}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-right">{field.value}%</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">Create Token</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Economics Preview</CardTitle>
            <CardDescription>See how your token will perform as it grows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-64">
              {previewData.length > 0 && (
                <LineChart 
                  data={previewData} 
                  xLabel="Token Supply" 
                  yLabel="Price (XLM)" 
                  title="Price Curve" 
                />
              )}
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">Key Metrics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Initial Market Cap</p>
                  <p className="text-2xl font-bold">{estimatedMarketCap.toFixed(2)} XLM</p>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Creator Reserve</p>
                  <p className="text-2xl font-bold">{creatorReserve.toFixed(0)} tokens</p>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Fee Revenue (est.)</p>
                  <p className="text-2xl font-bold">{estimatedFeeRevenue.toFixed(2)} XLM</p>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Initial Token Price</p>
                  <p className="text-2xl font-bold">{watchedValues.initialPrice} XLM</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground">
              <Info className="h-4 w-4 inline mr-1" />
              These projections are estimates and actual performance may vary based on market conditions.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateTokenPage;

