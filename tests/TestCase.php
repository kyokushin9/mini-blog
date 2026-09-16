<?php

namespace Tests;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Set up the test environment and clean the database before each test.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->prepareTestDatabase();
    }

    /**
     * Ensure the schema exists and truncate all tables before each test.
     *
     * This is a deterministic alternative to the RefreshDatabase / DatabaseTruncation
     * traits, which rely on asynchronous artisan calls and don't reliably clean
     * MySQL tables between tests.
     */
    protected function prepareTestDatabase(): void
    {
        $tables = DB::select('SHOW TABLES');

        // First run on a fresh database: create the schema synchronously.
        if (count($tables) === 0) {
            $this->artisan('migrate')->run();

            $tables = DB::select('SHOW TABLES');
        }

        $names = [];

        foreach ($tables as $row) {
            $names[] = Arr::first($row);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS = 0');

        foreach ($names as $name) {
            if ($name !== 'migrations') {
                DB::statement("TRUNCATE TABLE `{$name}`");
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS = 1');
    }
}
