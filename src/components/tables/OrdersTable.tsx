"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Badge from "@/components/ui/badge/Badge";

interface Order {
  id: string;
  customer: string;
  total: string;
  status: string;
  date: string;
}

const orders: Order[] = [
  {
    id: "#1021",
    customer: "Carlos Ramirez",
    total: "$350",
    status: "Pending",
    date: "12 Mar 2026",
  },
  {
    id: "#1022",
    customer: "Laura Gomez",
    total: "$890",
    status: "Paid",
    date: "12 Mar 2026",
  },
  {
    id: "#1023",
    customer: "Juan Torres",
    total: "$1200",
    status: "Shipped",
    date: "11 Mar 2026",
  },
  {
    id: "#1024",
    customer: "Ana Ruiz",
    total: "$220",
    status: "Cancelled",
    date: "10 Mar 2026",
  },
];

export default function OrdersTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">

      <Table>

        <TableHeader>

          <TableRow>

            <TableCell isHeader>Pedido</TableCell>
            <TableCell isHeader>Cliente</TableCell>
            <TableCell isHeader>Total</TableCell>
            <TableCell isHeader>Estado</TableCell>
            <TableCell isHeader>Fecha</TableCell>
            <TableCell isHeader className="text-end">
              Acciones
            </TableCell>

          </TableRow>

        </TableHeader>

        <TableBody>

          {orders.map((order) => (

            <TableRow key={order.id}>

              <TableCell>{order.id}</TableCell>

              <TableCell>{order.customer}</TableCell>

              <TableCell>{order.total}</TableCell>

              <TableCell>

                <Badge
                  color={
                    order.status === "Paid"
                      ? "success"
                      : order.status === "Pending"
                      ? "warning"
                      : order.status === "Shipped"
                      ? "primary"
                      : "error"
                  }
                >
                  {order.status}
                </Badge>

              </TableCell>

              <TableCell>{order.date}</TableCell>

              <TableCell className="text-end">

                <button className="text-blue-600 text-sm hover:underline">
                  Ver
                </button>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </div>
  );
}