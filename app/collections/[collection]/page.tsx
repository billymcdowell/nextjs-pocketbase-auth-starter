"use client";

import { useRealtime } from "@/hooks/use-sse";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { POCKETBASE_URL } from "@/lib/pocketbase";

export default function CollectionPage() {
    const { collection } = useParams();
    const { data, error, isLoading } = useRealtime(collection as string);

    console.log(data);
    console.log(error);


    if (error && error.includes('404')) return <div>Collection not found: {collection}</div>;
    if (error) return <div>Error: {error}</div>;
    if (isLoading || !data) return <div>Loading...</div>;

    if (data.length === 0) return <div>No data found for collection: {collection}</div>;


    const columns = Object.keys(data[0]);

    return (
        <Card className="p-2 py-4 max-w-7xl mx-auto m-4">
            <CardHeader>
                <CardTitle>Collection: {collection}</CardTitle>
            </CardHeader>
            <CardContent>
                {data && (
                <Table>
                    <TableCaption>All {collection} records</TableCaption>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column}>{column}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item: unknown, idx: number) => {
                            const typedItem = item as { collectionId: string; id: string };
                            return (
                              <TableRow key={idx} className="cursor-pointer" onClick={() => { window.open(`${POCKETBASE_URL}/_/#/collections?collection=${typedItem.collectionId}&filter=&sort=-%40rowid&recordId=${typedItem.id}`, '_blank', 'noopener,noreferrer,width=1000,height=800') }}>
                                  {columns.map((column) => (
                                    <TableCell key={column}>{(typedItem as Record<string, unknown>)[column] as string}</TableCell>
                                ))}
                            </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}