<?php

class User
{
    public function __construct(
        public $id,
        public $email,
        public $username,
        public $firstName,
        public $lastName,
        public $birthDate,
        public $createdAt,
        public $updatedAt,
    ) {
    }
}

