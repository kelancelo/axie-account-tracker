import { authOptions } from '../auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).json({ message: 'You must be logged in.' })
    } else if (req.method === 'GET') {
        const axieAccounts = await prisma.axieAccount.findMany({
            where: { userId: session.user.id },
            orderBy: { dateCreated: 'asc' }
        })
        res.status(200).json(axieAccounts)
    } else if (req.method === 'POST') {
        const accountData = req.body
        const newAccount = await prisma.axieAccount.create({
            data: {
                ...accountData,
                userId: session.user.id
            }
        })
        res.status(201).json({ message: 'Account added successfully.' })
    }
}