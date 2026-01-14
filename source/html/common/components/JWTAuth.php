<?php
namespace common\components;

use Yii;

class JWTAuth
{
    private static string $algo = 'HS256';

    private static function getSecretKey(): string
    {
        return Yii::$app->params['jwtSecret'];
    }

    public static function getToken($userId = null): string
    {
        $header = [
            'typ' => 'JWT',
            'alg' => self::$algo
        ];

        $payload = [
            'iss' => Yii::$app->name,
            'iat' => time(),
            'exp' => time() + 86400,
        ];

        if ($userId !== null) {
            $payload['uid'] = $userId;
        }

        $base64Header  = self::base64UrlEncode(json_encode($header));
        $base64Payload = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac(
            'sha256',
            $base64Header . '.' . $base64Payload,
            self::getSecretKey(),
            true
        );

        return $base64Header . '.' . $base64Payload . '.' . self::base64UrlEncode($signature);
    }

    public static function validateToken(string $token): bool
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }

        [$header, $payload, $signature] = $parts;

        $headerData = json_decode(self::base64UrlDecode($header), true);
        if (
            !is_array($headerData) ||
            ($headerData['alg'] ?? '') !== self::$algo ||
            ($headerData['typ'] ?? '') !== 'JWT'
        ) {
            return false;
        }

        $validSignature = self::base64UrlEncode(
            hash_hmac(
                'sha256',
                $header . '.' . $payload,
                self::getSecretKey(),
                true
            )
        );

        if (!hash_equals($validSignature, $signature)) {
            return false;
        }

        $payloadData = json_decode(self::base64UrlDecode($payload), true);

        if (
            !is_array($payloadData) ||
            ($payloadData['exp'] ?? 0) < time() ||
            ($payloadData['iss'] ?? null) !== Yii::$app->name
        ) {
            return false;
        }

        return true;
    }

    public static function decode(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        $payload = json_decode(self::base64UrlDecode($parts[1]), true);
        return is_array($payload) ? $payload : null;
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
