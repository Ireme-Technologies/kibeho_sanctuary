<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pilgrim_enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->string('enquiry_type', 40)->default('general'); // visit|group|prayer|donation|accommodation|general
            $table->string('channel', 20)->default('email'); // email|whatsapp
            $table->string('status', 30)->default('new'); // new|in_progress|pending_client|closed
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        Schema::create('pilgrim_enquiry_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pilgrim_enquiry_id')->constrained('pilgrim_enquiries')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('author_type', 20); // client|admin|system
            $table->text('body');
            $table->timestamps();
        });

        Schema::create('pilgrim_enquiry_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pilgrim_enquiry_id')->constrained('pilgrim_enquiries')->cascadeOnDelete();
            $table->foreignId('pilgrim_enquiry_message_id')->nullable()->constrained('pilgrim_enquiry_messages')->nullOnDelete();
            $table->string('uploaded_by', 20); // client|admin
            $table->string('path');
            $table->string('url');
            $table->string('original_name')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->timestamps();
        });

        if (Schema::hasTable('contact_messages')) {
            $rows = DB::table('contact_messages')->orderBy('id')->get();
            foreach ($rows as $row) {
                $pilgrimEnquiryId = DB::table('pilgrim_enquiries')->insertGetId([
                    'name' => $row->name,
                    'email' => $row->email,
                    'phone' => $row->phone,
                    'subject' => $row->subject ?? null,
                    'message' => $row->message,
                    'enquiry_type' => $row->topic ?? 'general',
                    'channel' => 'email',
                    'status' => $row->is_read ? 'in_progress' : 'new',
                    'user_id' => null,
                    'is_read' => (bool) $row->is_read,
                    'created_at' => $row->created_at,
                    'updated_at' => $row->updated_at,
                ]);

                DB::table('pilgrim_enquiry_messages')->insert([
                    'pilgrim_enquiry_id' => $pilgrimEnquiryId,
                    'user_id' => null,
                    'author_type' => 'client',
                    'body' => $row->message,
                    'created_at' => $row->created_at,
                    'updated_at' => $row->updated_at,
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('pilgrim_enquiry_documents');
        Schema::dropIfExists('pilgrim_enquiry_messages');
        Schema::dropIfExists('pilgrim_enquiries');
    }
};
