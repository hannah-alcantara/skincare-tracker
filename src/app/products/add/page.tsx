import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function AddProductPage() {
  return (
    <div className='max-w-2xl mx-auto space-y-6'
    >
      <div>
        <h1 className="text-3xl font-bold tracking-light">
          Add Product
        </h1>
        <p className="text-muted-background">Add a new product to your collection</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input id="brand"></Input>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name"></Input>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Product Type *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {/* Dropdown items go here */}
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
