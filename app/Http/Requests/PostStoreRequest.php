<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PostStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:posts,slug',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'user_id' => 'required|exists:users,id',
            'excerpt' => 'nullable|string',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ];
    }

    protected function prepareForValidation(): void 
    {
        $this->merge([
            'slug' => $this->slug ?? \Illuminate\Support\Str::slug($this->title),
            'user_id' => auth()->id(),
        ]);
    }
}
