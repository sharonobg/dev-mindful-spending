import {z} from 'zod';

const mycategoriesschema = z.object({
        mycategoryId:z.string().nonempty(),
        isChecked:z.boolean(),
        planamount:z.number().gt(0),
        explain:z.string().optional().or(z.literal("")),
        categorynotes:z.string().optional().or(z.literal("")),
     })
export const TransactionDataSchema = z.object({
    transdate:z.date(),
    acctype:z.enum(["debit", "cash", "bank_account","other"]),
    categoryId:z.string().nonempty(),
    descr:z.string().nonempty().or(z.literal("")),
    amount:z.number().gt(0),
});
export type TransactionDataValues = z.infer<typeof TransactionDataSchema>;
export const SpendingPlanDataSchema = z.object({
    planmonthyear:z.date(),
    mycategories: mycategoriesschema
})
export type SpendingPlanDataValues = z.infer<typeof SpendingPlanDataSchema>;