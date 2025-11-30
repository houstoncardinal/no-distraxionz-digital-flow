import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TaxCalculation {
  state: string;
  rate: number;
  amount: number;
  subtotal: number;
}

export const useTaxCalculation = (state: string, subtotal: number) => {
  const [tax, setTax] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const calculateTax = async () => {
      // Only calculate if we have both state and subtotal
      if (!state || !subtotal || subtotal <= 0) {
        setTax(0);
        setTaxRate(0);
        return;
      }

      setIsCalculating(true);

      try {
        const { data, error } = await supabase.functions.invoke('calculate-tax', {
          body: { state, subtotal }
        });

        if (error) {
          console.error('Error calculating tax:', error);
          // Fallback to 0% if calculation fails
          setTax(0);
          setTaxRate(0);
          return;
        }

        const taxData = data as TaxCalculation;
        setTax(taxData.amount);
        setTaxRate(taxData.rate);
      } catch (error) {
        console.error('Tax calculation failed:', error);
        // Fallback to 0% if calculation fails
        setTax(0);
        setTaxRate(0);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateTax();
  }, [state, subtotal]);

  return { tax, taxRate, isCalculating };
};