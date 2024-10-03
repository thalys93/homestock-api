export class CreateExpenseDto {
    name: string;
    isPaid: boolean;
    isLate: boolean;
    amount: number;
    dueDate: Date;
    category: string;
    frequency: string;
    reminder: boolean;
}
