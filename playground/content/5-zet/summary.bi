~ a group|group-x

@gallery
    images:
        -   src: ava.jpg
            invert: light

        -   src: ava.jpg
            invert: dark
            maxWidth: 450px
            caption:
              main: Черный как нефть негр

Привет, мир!\
А это мой красивый текст! [Anthony](page|article|/test/link)

@table
    caption:
        main: Сводная таблица
        secondary: Тут много всякого важного!
    cells: |
        | Черный | Белый | Цветной
        Юбка    | ЮЧ | ЮБ | ЮЦ
        Штаны   | ШЧ | ШБ | ШЦ
        Футболка| ФЧ | ФБ | ФЦ
        Блузка  | БЧ | ББ | БЦ

@important
    main: |
        @table
                    | Черный | Белый | Цветной
            Юбка    | ЮЧ | ЮБ | ЮЦ
            Штаны   | ШЧ | ШБ | ШЦ
            Футболка| ФЧ | ФБ | ФЦ
            Блузка  | БЧ | ББ | БЦ

@statement
    main: |
        @table
                    | Черный | Белый | Цветной
            Юбка    | ЮЧ | ЮБ | ЮЦ
            Штаны   | ШЧ | ШБ | ШЦ
            Футболка| ФЧ | ФБ | ФЦ
            Блузка  | БЧ | ББ | БЦ

@term
    main: |
        @table
                    | Черный | Белый | Цветной
            Юбка    | ЮЧ | ЮБ | ЮЦ
            Штаны   | ШЧ | ШБ | ШЦ
            Футболка| ФЧ | ФБ | ФЦ
            Блузка  | БЧ | ББ | БЦ

@example
    main: |
        @table
                    | Черный | Белый | Цветной
            Юбка    | ЮЧ | ЮБ | ЮЦ
            Штаны   | ШЧ | ШБ | ШЦ
            Футболка| ФЧ | ФБ | ФЦ
            Блузка  | БЧ | ББ | БЦ

$$ A^2 + B^2 = C^2 $$

@callout
    title: Hello World
    icon: ava.jpg
    content: |
        Привет, мир!

        $$ A^2 + B^2 = C^2 $$

@image
    src: ava.jpg
    invert: light
    maxWidth: 200px
    caption:
        main: This is me!
        maxWidth: 300px
        secondary: And my $f(x) = 2$ brother [Anthony](page|article|/test/link)...

@callout
    title: Винстон Черчиль о Блетчли Парке
    icon: quote
    content: |
        Привет, мир!

        $$ A^2 + B^2 = C^2 $$