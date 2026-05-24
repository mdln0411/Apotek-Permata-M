<?php

namespace App\Support;

use Carbon\Carbon;
use Carbon\CarbonInterface;

class IndonesianDateTime
{
    public const TIMEZONE = 'Asia/Jakarta';

    public static function format(?CarbonInterface $date, string $pattern = 'd M Y, H:i'): ?string
    {
        if ($date === null) {
            return null;
        }

        return $date
            ->copy()
            ->timezone(self::TIMEZONE)
            ->locale('id')
            ->translatedFormat($pattern) . ' WIB';
    }

    public static function toIso8601(?CarbonInterface $date): ?string
    {
        if ($date === null) {
            return null;
        }

        return $date->copy()->utc()->toIso8601String();
    }
}
