import { authOptions } from '../auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).json({ message: 'You must be logged in.' })
    } else if (req.method === 'PATCH') {
        const updateData = req.body
        const updatedAccount = await prisma.axieAccount.update({
            where: { roninAdd: req.query.roninAdd },
            data: {
                name: updateData.name,
                scholarShare: updateData.scholarShare,
                managerShare: updateData.managerShare
            }
        })
        res.status(200).json({ message: 'Account updated successfully.' })
    } else if (req.method === 'DELETE') {
        const deletedAccount = await prisma.axieAccount.delete({
            where: { roninAdd: req.query.roninAdd }
        })
        res.status(200).json({ message: 'Account deleted successfully.' })
    }
}