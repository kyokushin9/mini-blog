<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CommentStoreRequest extends FormRequest
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
            'body' => 'required|string|max:2000',
        ];
    }

    protected function prepareForValidation(): void 
    {
        // Примечание: user_id и post_id подставляются в контроллере
        // (из авторизованного пользователя и привязанной модели маршрута),
        // т.к. на этапе prepareForValidation они ещё не доступны надёжно.
    }
}
