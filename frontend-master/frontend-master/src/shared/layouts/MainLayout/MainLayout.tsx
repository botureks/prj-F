import { useState } from "react";

import {
    PostSearch,
    PostSearchFilters
} from "src/features/searchPosts/ui/PostSearch";
import { PostsList } from "src/widgets/PostsList/PostsList";

const INITIAL_FILTERS: PostSearchFilters = {
    search: "",
    tagIds: []
};

export const MainLayout = () => {
    const [filters, setFilters] = useState<PostSearchFilters>(INITIAL_FILTERS);

    return (
        <div className="container">
            <PostSearch value={filters} onChange={setFilters}/>
            <PostsList search={filters.search} tagIds={filters.tagIds}/>
        </div>
    );
};