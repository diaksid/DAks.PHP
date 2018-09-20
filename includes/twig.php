<?php

namespace PRO\Twig;

final class Fn
{
    static function icon()
    {
        $fn = function (string $class, $attrs = []) {
            $class = "icon icon-$class";
            if (array_key_exists('class', $attrs)) {
                $attrs['class'] = "$class " . $attrs['class'];
            } else {
                $attrs = array_merge(['class' => $class], $attrs);
            }
            $attrs = array_merge($attrs, ['aria-hidden' => 'true']);
            $attributes = '';
            foreach ($attrs as $key => $value) {
                $attributes .= ($attributes ? " $key" : $key) . ($value === '' ?: "=\"$value\"");
            }
            return "<span $attributes></span>";
        };

        return new \Twig_Function('icon', $fn, [
            'is_safe' => ['all']
        ]);

    }
}
