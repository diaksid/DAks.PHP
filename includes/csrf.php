<?php

namespace PRO;

final class CSRF
{
    public static function get_token_id()
    {
        if (isset($_SESSION['csrf_id'])) {
            return $_SESSION['csrf_id'];
        } else {
            $id = self::_random(10);
            $_SESSION['csrf_id'] = $id;
            return $id;
        }
    }

    public static function get_token()
    {
        if (isset($_SESSION['csrf_token'])) {
            return $_SESSION['csrf_token'];
        } else {
            $token = hash('sha256', self::_random(500));
            $_SESSION['csrf_token'] = $token;
            return $token;
        }

    }

    public static function check_valid($method)
    {
        if ($method === 'POST' || $method === 'GET') {
            $method = "\$_$method";
            if (isset(${$method}[self::get_token_id()]) && (${$method}[self::get_token_id()] == self::get_token())) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    private static function _random($len)
    {
        $byteLen = intval(($len / 2) + 1);
        return substr(bin2hex(openssl_random_pseudo_bytes($byteLen)), 0, $len);
    }
}
