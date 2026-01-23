// import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Filter, 
  X,
  AlertCircle,
  PackageCheck
} from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { useEffect } from 'react';

const Inventory = () => {
  const { products, getProducts } = useInventoryStore();
  useEffect(() => {
    getProducts();
  }, [getProducts]);
  console.log(products);
  return (
    <div className='text-slate-50'>
      <h1>Inventory</h1>
    </div>
  )
}

export default Inventory