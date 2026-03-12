import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OrdersTable from "@/components/tables/OrdersTable";

export default function OrdersPage() {
  return (
    <div>

      <PageBreadcrumb pageTitle="Pedidos" />

      <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6">

        <div>

          <h2 className="text-2xl font-semibold text-gray-800">
            Pedidos
          </h2>

          <p className="text-sm text-gray-500">
            Gestiona los pedidos de tu tienda
          </p>

        </div>

        <OrdersTable />

      </div>

    </div>
  );
}