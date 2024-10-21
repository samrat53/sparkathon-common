import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getItemPrice=async (id:number): Promise<number>=>{
    const price=Number(await prisma.item.findFirst({
        where:{
            itemId: id
        },
        select:{
            price: true,
        }
    }));
    if(!price) return 0;
    return price;
}

export const findOrderSum = async (orderIds: number[]) => {
    const size=orderIds.length;
    let sum:number=0;
    const prices=await Promise.all(orderIds.map(id=>getItemPrice(id)));
    for(let i=0;i<size;i++){
        sum+=prices[i];
    }
    return sum;
};
