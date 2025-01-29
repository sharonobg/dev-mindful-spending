"use server"

import Category from "@/models/categoryModel";

export async function getCategories(){

    const categories= await Category.find().select(['title']).sort({ title: 1 });
return categories
}
