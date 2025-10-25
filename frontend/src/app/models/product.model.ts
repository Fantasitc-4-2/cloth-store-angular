export interface Product {
	_id?: string;
	title: string;
	description?: string;
	category?: string;
	price?: number;
	image?: string;
	quantity?: number;
	sold?: number;
	reviewCount?: number;
	averageRating?: number;
	sizes?: string[];
	colors?: string[];
	createdBy?: string;
}

export type ProductId = string;
