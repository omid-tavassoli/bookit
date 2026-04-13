<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(array $overrides = []): User
    {
        return User::create(array_merge([
            'name'     => 'Test User',
            'email'    => 'test@example.com',
            'password' => 'password123',
            'role'     => 'client',
        ], $overrides));
    }

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name'     => 'Jane Doe',
            'email'    => 'jane@example.com',
            'password' => 'password123',
            'role'     => 'client',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['user' => ['id', 'name', 'email', 'role'], 'token']);
    }

    public function test_register_with_invalid_role_returns_422(): void
    {
        $response = $this->postJson('/api/register', [
            'name'     => 'Jane Doe',
            'email'    => 'jane@example.com',
            'password' => 'password123',
            'role'     => 'superadmin',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['role']);
    }

    public function test_register_with_duplicate_email_returns_422(): void
    {
        $this->makeUser(['email' => 'jane@example.com']);

        $response = $this->postJson('/api/register', [
            'name'     => 'Another Jane',
            'email'    => 'jane@example.com',
            'password' => 'password123',
            'role'     => 'client',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_user_can_login(): void
    {
        $this->makeUser(['email' => 'jane@example.com', 'password' => 'password123']);

        $response = $this->postJson('/api/login', [
            'email'    => 'jane@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['user', 'token']);
    }

    public function test_login_fails_with_wrong_credentials_returns_422(): void
    {
        $this->makeUser(['email' => 'jane@example.com', 'password' => 'correctpassword']);

        $response = $this->postJson('/api/login', [
            'email'    => 'jane@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = $this->makeUser();
        $token = $user->createToken('auth_token')->plainTextToken;

        // actingAs() gives a TransientToken that doesn't support delete(),
        // so we authenticate via a real Sanctum token in the Authorization header.
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Logged out successfully.']);
    }

    public function test_unauthenticated_request_to_logout_returns_401(): void
    {
        $this->postJson('/api/logout')->assertStatus(401);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = $this->makeUser(['email' => 'jane@example.com']);

        $response = $this->actingAs($user)->getJson('/api/me');

        $response->assertStatus(200)
            ->assertJsonFragment(['email' => 'jane@example.com']);
    }

    public function test_unauthenticated_request_to_me_returns_401(): void
    {
        $this->getJson('/api/me')->assertStatus(401);
    }
}
