import { z } from "zod";

export const scholarshipSchema = z.object({
  installments: z.array(
    z.object({
      scholarshipName: z.string(),
      scholarshipPercentage: z.number(),
      scholarshipClearance: z.string(),
      installmentDetails: z.array(
        z.object({
          semester: z.number(),
          installments: z.array(
            z.object({
              installmentDate: z.string(),
              amountPayable: z.number(),
              scholarshipAmount: z.number(),
              baseFee: z.number(),
            })
          ),
        })
      ),
      oneShotPayment: z.object({
        installmentDate: z.string(),
        amountPayable: z.number(),
        scholarshipAmount: z.number(),
        OneShotPaymentAmount: z.number(),
        gstAmount: z.number(),
        baseFee: z.number(),
      }),
    })
  ),
});
