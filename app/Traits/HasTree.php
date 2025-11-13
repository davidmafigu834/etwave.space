<?php

namespace App\Traits;

trait HasTree
{
    /**
     * Get all children of this node.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function children()
    {
        return $this->hasMany(static::class, $this->getParentIdName())->with('children');
    }

    /**
     * Get the parent of this node.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function parent()
    {
        return $this->belongsTo(static::class, $this->getParentIdName());
    }

    /**
     * Get the name of the parent id column.
     *
     * @return string
     */
    public function getParentIdName()
    {
        return 'parent_id';
    }

    /**
     * Get all ancestors of this node.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAncestors()
    {
        $ancestors = collect();
        
        $parent = $this->parent;
        
        while ($parent) {
            $ancestors->push($parent);
            $parent = $parent->parent;
        }
        
        return $ancestors;
    }

    /**
     * Get all descendants of this node.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getDescendants()
    {
        $descendants = collect();
        
        foreach ($this->children as $child) {
            $descendants->push($child);
            $descendants = $descendants->merge($child->getDescendants());
        }
        
        return $descendants;
    }

    /**
     * Check if this node is a root node.
     *
     * @return bool
     */
    public function isRoot()
    {
        return is_null($this->{$this->getParentIdName()});
    }

    /**
     * Check if this node is a leaf node.
     *
     * @return bool
     */
    public function isLeaf()
    {
        return $this->children->count() === 0;
    }

    /**
     * Get the depth level of this node.
     *
     * @return int
     */
    public function getLevel()
    {
        return $this->getAncestors()->count();
    }

    /**
     * Scope a query to only include root nodes.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRoot($query)
    {
        return $query->whereNull($this->getParentIdName());
    }

    /**
     * Scope a query to only include leaf nodes.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLeaf($query)
    {
        return $query->whereDoesntHave('children');
    }

    /**
     * Convert the collection to a tree structure.
     *
     * @param  \Illuminate\Database\Eloquent\Collection  $collection
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function toTree($collection)
    {
        $tree = collect();
        $items = $collection->keyBy('id');
        
        foreach ($items as $item) {
            if ($item->{$this->getParentIdName()}) {
                $parent = $items->get($item->{$this->getParentIdName()});
                if ($parent) {
                    if (!isset($parent->children)) {
                        $parent->children = collect();
                    }
                    $parent->children->push($item);
                }
            } else {
                $tree->push($item);
            }
        }
        
        return $tree;
    }
}
